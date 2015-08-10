import Ember from "ember";
import config from '../config/environment';
import Settings from '../models/settings';

const {
  computed: { equal },
  observer,
  run
} = Ember;

export default Ember.Controller.extend({
  emberCli: Ember.inject.service('ember-cli'),
  version: config.APP.version,
  init() {
    this._super(...arguments);
    this.setupWindowUpdate();
  },

  /**
   * Output from the build, sets the `code` attr on the component
   * @type {String}
   */
  buildOutput: '',
  isBuilding: false,
  unsaved: true,
  activeFile: null,
  activeEditorCol: null,
  col1File: null,
  col2File: null,
  col1Active: equal('activeEditorCol','1'),
  col2Active: equal('activeEditorCol','2'),

  settings: Settings.create(),

  /**
   * Errors during build
   * @type {Array}     Array of errors
   */
  buildErrors: null,

  /**
   * Whether user wishes the code to automatically run
   * @type {boolean}
   */
  isLiveReload: true,

  /**
   * Build the application and set the iframe code
   */
  buildApp () {
    if (this.get('isDestroyed')) {
      return;
    }

    this.set('isBuilding', true);
    this.set('buildErrors', []);

    this.get('emberCli').compileGist(this.get('model')).then(buildOutput => {
      this.set('isBuilding', false);
      this.set('buildOutput', buildOutput);
    })
    .catch(errors => {
      this.set('isBuilding', false);
      this.set('buildErrors', errors);
      errors.forEach(error => {
        console.error(error);
      });
    });
  },

  /**
   * Set the initial file columns
   */
  initializeColumns: observer('model', function() {
    var files = this.get('model.files');

    if(files.objectAt(0)) {
      this.set('col1File', files.objectAt(0));
    }

    if(files.objectAt(1)) {
      this.set('col2File', files.objectAt(1));
    }
  }),

  rebuildApp: function() {
    if (this.get('isLiveReload')) {
      run.debounce(this, this.buildApp, 500);
    }
  },

  createFile(filePath, fileProperties) {
    if (filePath) {
      if(this.get('model.files').findBy('filePath', filePath)) {
        alert('A file with the name %@ already exists'.fmt(filePath));
        return;
      }

      fileProperties.filePath = filePath;
      let file = this.store.createRecord('gistFile', fileProperties);

      this.get('model.files').pushObject(file);
      this.notify.info('File %@ was added'.fmt(file.get('filePath')));
      this.set('col1File', file);
      this.set('activeEditorCol', '1');
      this.send('contentsChanged');
    }
  },
  /*
   *  Test whether path is valid.  Presently only tests whether components are hyphenated.
   */
  isPathInvalid(type, path){
    let errorMsg = null;
    if (type.match(/^component/)) {
      if(!path.match(/-[^\/]+$/)) {
         errorMsg = 'Component file names need to include a hyphen';
      }
    }
    if (errorMsg) {
      alert(errorMsg);
      return true;
    }
    return false;
  },
  actions: {
    contentsChanged() {
      this.set('unsaved', true);
      this.rebuildApp();
    },

    liveReloadChanged(isLiveReload) {
      this.set('isLiveReload', isLiveReload);
      this.rebuildApp();
    },

    focusEditor (editor) {
      this.set('activeEditorCol', editor.get('col'));
      this.set('activeFile', editor.get('file'));
    },

    selectFile (file) {
      this.set('activeFile', file);
    },

    runNow () {
      this.buildApp();
    },

    deleteGist (gist) {
      if(confirm(`Are you sure you want to remove this gist from Github?\n\n${gist.get('description')}`)) {
        gist.destroyRecord();
        this.transitionToRoute('gist.new');
        this.notify.info('Gist %@ was deleted from Github'.fmt(gist.get('id')));
      }
    },

    addComponent() {
      let path = prompt('Component path (without file extension)', 'components/my-component');
      if (Ember.isBlank(path)){
        return;
      }

      //strip file extension if present
      path = path.replace(/\.[^/.]+$/, "");

      if (this.isPathInvalid('component', path)) {
        return;
      }
      ['js', 'hbs'].forEach((fileExt)=>{
        let fileProperties = this.get('emberCli').buildProperties(`component-${fileExt}`);
        let filePath =  `${fileExt === 'hbs' ? 'templates/' : ''}${path}.${fileExt}`;
        this.createFile(filePath, fileProperties);
      });
    },
    /**
     * Add a new file to the model
     * @param {String|null} type Blueprint name or null for empty file
     */
    addFile (type) {
      let fileProperties = type ? this.get('emberCli').buildProperties(type) : {filePath:'file.js'};
      let filePath = fileProperties.filePath;

      if (['twiddle.json','router', 'css'].indexOf(type)===-1) {
        filePath = prompt('File path', filePath);
      }
      if (this.isPathInvalid(type, filePath)) {
        return;
      }
      this.createFile(filePath, fileProperties);
    },

    renameFile (file) {
      let filePath = prompt('File path', file.get('filePath'));
      if (filePath) {
        if(this.get('model.files').findBy('filePath', filePath)) {
          alert('A file with the name %@ already exists'.fmt(filePath));
          return;
        }

        file.set('filePath', filePath);
        this.notify.info('File %@ was added'.fmt(file.get('filePath')));
      }
    },

    removeFile (file) {
      if(confirm(`Are you sure you want to remove this file?\n\n${file.get('filePath')}`)) {
        file.deleteRecord();
        this.notify.info('File %@ was deleted'.fmt(file.get('filePath')));
        this._removeFileFromColumns(file);

        this.send('contentsChanged');
      }
    },

    setEditorKeyMap (keyMap) {
      const settings = this.get('settings');
      settings.set('keyMap', keyMap);
      settings.save();
    }
  },

  _removeFileFromColumns (file) {
    if(this.get('col1File') === file) {
      this.set('col1File', null);
    }
    if(this.get('col2File') === file) {
      this.set('col2File', null);
    }
  },

  setupWindowUpdate: function() {
    // TODO: this in a controller seems suspect, rather this should likely be
    // part of some handshake, to ensure no races exist. This should likley not
    // be something a controller would handle - (SP)
    window.addEventListener('message', (m) => {
      run(() => {
        if(typeof m.data==='object' && 'setDemoAppUrl' in m.data) {
          if (!this.get('isDestroyed')) {
            this.set('applicationUrl', m.data.setDemoAppUrl || '/');
          }
        }
      });
    });
  }
});
