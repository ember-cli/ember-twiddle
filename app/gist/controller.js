import Ember from "ember";
import config from '../config/environment';

const {
  computed: { equal, gte },
  observer,
  run
} = Ember;

const MAX_COLUMNS = 3;

export default Ember.Controller.extend({
  emberCli: Ember.inject.service('ember-cli'),
  version: config.APP.version,

  queryParams: ['numColumns'],
  numColumns: 2,

  init() {
    this._super(...arguments);
    this.setupWindowUpdate();
  },

  /**
   * Output from the build, sets the `code` attr on the component
   * @type {String}
   */
  buildOutput: '',

  /**
   * If the code is currently being built
   * @type {boolean}
   */
  isBuilding: false,

  /**
   * If the edited code has not been saved by the user
   * @type {boolean}
   */
  unsaved: true,

  /**
   * File in the current active editor column
   * @type {Object}
   */
  activeFile: null,

  /**
   * Column which has the currently focused editor
   * @type {Number}
   */
  activeEditorCol: null,

  col1File: null,
  col2File: null,
  col3File: null,
  col1Active: equal('activeEditorCol','1'),
  col2Active: equal('activeEditorCol','2'),
  col3Active: equal('activeEditorCol','3'),
  showCol1: gte('realNumColumns', 1),
  showCol2: gte('realNumColumns', 2),
  showCol3: gte('realNumColumns', 3),

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
  initializeColumns: observer('model', 'numColumns', function() {
    let files = this.get('model.files');
    let numColumns = Math.min(this.get('numColumns'), MAX_COLUMNS);

    let j = 0;
    for (let i = 0; i < numColumns; ++i) {
      let key = 'col' + (i + 1) + 'File';
      if (!this.get(key)) {
        if (files && files.objectAt(j)) {
          this.set(key, files.objectAt(j++));
        }
      }
    }

    this.set('realNumColumns', numColumns);
  }),

  rebuildApp: function() {
    if (this.get('isLiveReload')) {
      run.debounce(this, this.buildApp, 500);
    }
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

    fork (gist) {
      gist.fork().then((response) => {
        this.transitionToRoute('gist.edit', response.id);
      });
    },

    removeFile (file) {
      if(confirm(`Are you sure you want to remove this file?\n\n${file.get('filePath')}`)) {
        file.deleteRecord();
        this.notify.info('File %@ was deleted'.fmt(file.get('filePath')));
        this._removeFileFromColumns(file);

        this.send('contentsChanged');
      }
    },

    removeColumn (col) {
      let key = "col" + col;
      let numColumns = this.get('realNumColumns');

      for (var i = (col|0) + 1; i <= numColumns; ++i) {
        this.set(key + "File", this.get("col" + i + "File"));
        this.set(key + "Active", this.get("col" + i + "Active"));
      }

      this.transitionToRoute({queryParams: {numColumns: numColumns - 1}}).then(function() {
        this.set('realNumColumns', numColumns - 1);
      }.bind(this));
    },

    addColumn() {
      let numColumns = this.get('realNumColumns');

      this.transitionToRoute({queryParams: {numColumns: numColumns + 1}}).then(function() {
        this.set('realNumColumns', numColumns + 1);
      }.bind(this));
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
