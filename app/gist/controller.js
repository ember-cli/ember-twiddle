import Ember from "ember";
import Settings from '../models/settings';
import ErrorMessages from 'ember-twiddle/helpers/error-messages';
import Column from '../utils/column';

const {
  computed,
  run,
  inject
} = Ember;

const MAX_COLUMNS = 3;

export default Ember.Controller.extend({
  emberCli: inject.service('ember-cli'),
  dependencyResolver: inject.service(),
  notify: inject.service('notify'),

  queryParams: ['numColumns', 'fullScreen', 'route', 'openFiles'],
  numColumns: 2,
  fullScreen: false,
  openFiles: "",

  init() {
    this._super(...arguments);
    this.createColumns();
    this.setupWindowUpdate();
    this.set('activeEditorCol', '1');
  },

  emberVersions: computed.oneWay('dependencyResolver.emberVersions'),
  emberDataVersions: computed.oneWay('dependencyResolver.emberDataVersions'),

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

  columns: null,

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
   * Whether the file tree is currently shown
   */
  fileTreeShown: false,

  /**
   * Build the application and set the iframe code
   */
  buildApp () {
    if (this.get('isDestroyed')) {
      return;
    }

    this.set('isBuilding', true);
    this.set('buildErrors', []);
    this.set('model.initialRoute', this.get('route'));

    this.get('emberCli').compileGist(this.get('model')).then(buildOutput => {
      this.set('isBuilding', false);
      this.set('buildOutput', buildOutput);
    })
    .catch(errors => {
      this.set('isBuilding', false);
      if (Ember.isArray(errors)) {
        this.set('buildErrors', errors);
        errors.forEach(error => {
          console.error(error);
        });
      } else {
        console.error(errors);
      }
    });
  },

  realNumColumns: computed('numColumns', function() {
    return Math.min(this.get('numColumns'), MAX_COLUMNS);
  }),
  noColumns: computed.equal('numColumns', 0),

  /**
   * Creates the column objects
   */
  createColumns() {
    let columns = [];
    for (let i = 0; i < MAX_COLUMNS; ++i) {
      let col = (i + 1) + "";
      columns.pushObject(Column.create({
        col: col,
        controller: this
      }));
    }
    this.set('columns', columns);
  },

  /**
   * Clears the columns
   */
  clearColumns() {
    let numColumns = this.get('realNumColumns');
    for (let i = 1; i <= numColumns; ++i) {
      this.setColumnFile(i, undefined);
    }
  },

  /**
   * Set the initial files in the columns
   */
  initializeColumns() {
    const files = this.get('model.files');
    const openFileNames = this.get('openFiles').split(",");
    const openFiles = openFileNames.map((file) => files.findBy('fileName', file));

    for (let i = 1; i <= openFiles.length; ++i) {
      this.setColumnFile(i, openFiles[i - 1]);
    }

    const numColumns = this.get('realNumColumns');

    let j = 0;
    for (let i = 1; i <= numColumns; ++i) {
      if (!this.getColumnFile(i)) {
        if (files) {
          j = 0;
          while (!this.isOpen(files.objectAt(j))) {
            j++;
          }
          let file = files.objectAt(j);
          if (file) {
            this.setColumnFile(i, file);
          }
        }
      }
    }
  },

  /**
   * Returns true if the passed in file is currently open
   * @param {Object} one of the files in the gist
   * @return {boolean}
   */
  isOpen(file) {
    if (!file) {
      return false;
    }

    for (let i = 1; i <= MAX_COLUMNS; ++i) {
      let colFile = this.getColumnFile(i);
      if (colFile && colFile.get('fileName') === file.get('fileName')){
        return false;
      }
    }

    return true;
  },

  rebuildApp: function() {
    if (this.get('isLiveReload')) {
      run.debounce(this, this.buildApp, 500);
    }
  },

  createFile(filePath, fileProperties, fileColumn=1) {
    if (filePath) {
      if(this.get('model.files').findBy('filePath', filePath)) {
        alert(`A file with the name ${filePath} already exists`);
        return;
      }

      fileProperties.filePath = filePath;
      let file = this.get('store').createRecord('gistFile', fileProperties);

      this.get('model.files').pushObject(file);
      this.get('notify').info(`File ${file.get('filePath')} was added`);
      this.setColumnFile(fileColumn, file);
      this.set('activeEditorCol', '1');
      this.send('contentsChanged');
      this._updateOpenFiles();
    }
  },

  /*
   *  Test whether path is valid.  Presently only tests whether components are hyphenated.
   */
  isPathInvalid(type, path){
    let errorMsg = null;
    if (type.match(/^component/)) {
      if (!path.match(/[^\/]+-[^\/]+(\/(component\.js|template\.hbs))?$/)) {
         errorMsg = ErrorMessages.componentsNeedHyphens;
      }
    }
    if (errorMsg) {
      alert(errorMsg);
      return true;
    }
    return false;
  },

  getColumnFile(column) {
    return this.get('columns').objectAt(column - 1).get('file');
  },

  setColumnFile(column, file) {
    this.get('columns').objectAt(column - 1).set('file', file);
  },

  _updateOpenFiles() {
    const columns = this.get('columns');
    const fileNames = columns.map(column => column.get('file.fileName'));
    const openFiles = fileNames.join(",").replace(/^,|,$/g, '');
    this.set('openFiles', openFiles);
  },

  actions: {
    contentsChanged() {
      this.set('unsaved', true);
      this.rebuildApp();
    },

    versionSelected: function(dependency, version) {
      var gist = this.get('model');
      var emberCli = this.get('emberCli');

      emberCli.updateDependencyVersion(gist, dependency, version).then(() => {
        this.rebuildApp();
      });
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
      this._updateOpenFiles();
    },

    openFile(filePath) {
      let file = this.get('model.files').findBy('filePath', filePath);
      let activeCol = this.get('activeEditorCol') || '1';
      this.setColumnFile(activeCol, file);
      this.set('activeEditorCol', activeCol);
      this.set('activeFile', file);
      this._updateOpenFiles();
    },

    runNow () {
      this.buildApp();
    },

    titleChanged() {
      this.set('unsaved', true);
      this.send('titleUpdated');
    },

    showFileTree() {
      this.set('fileTreeShown', true);
    },

    hideFileTree() {
      this.set('fileTreeShown', false);
    },

    deleteGist (gist) {
      if(confirm(`Are you sure you want to remove this gist from Github?\n\n${gist.get('description')}`)) {
        gist.destroyRecord();
        this.transitionToRoute('gist.new');
        this.get('notify').info(`Gist ${gist.get('id')} was deleted from Github`);
      }
    },

    addComponent() {
      let path = prompt('Component path (without file extension)', 'my-component');
      if (Ember.isBlank(path)){
        return;
      }

      //strip file extension if present
      path = path.replace(/\.[^/.]+$/, "");

      if (this.isPathInvalid('component', path)) {
        return;
      }
      ['js', 'hbs'].forEach((fileExt, i)=>{
        let fileProperties = this.get('emberCli').buildProperties(`component-${fileExt}`);
        let notPodPrefix = "components/";
        let filePath;
        if (path.substr(0, notPodPrefix.length) === notPodPrefix) {
          filePath =  `${fileExt === 'hbs' ? 'templates/' : ''}${path}.${fileExt}`;
        } else {
          filePath = path + "/" + (fileExt === 'hbs' ? 'template.hbs' : 'component.js');
        }
        let fileColumn = i+1;
        this.createFile(filePath, fileProperties, fileColumn);
      });
    },

    addHelper() {
      let type = 'helper';
      let fileProperties = this.get('emberCli').buildProperties(type);
      let filePath = prompt('File path', fileProperties.filePath);
      let splitFilePath = filePath.split('/');
      let file = splitFilePath[splitFilePath.length - 1];
      let name = file.replace('.js', '').camelize();

      fileProperties = this.get('emberCli').buildProperties(type, {
        camelizedModuleName: name
      });

      if (this.isPathInvalid(type, filePath)) {
        return;
      }
      this.createFile(filePath, fileProperties);
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
      this._updateOpenFiles();
    },

    renameFile (file) {
      let filePath = prompt('File path', file.get('filePath'));
      if (filePath) {
        if(this.get('model.files').findBy('filePath', filePath)) {
          alert(`A file with the name ${filePath} already exists`);
          return;
        }

        file.set('filePath', filePath);
        this.get('notify').info(`File ${file.get('filePath')} was added`);
        this._updateOpenFiles();
      }
    },

    removeFile (file) {
      if(confirm(`Are you sure you want to remove this file?\n\n${file.get('filePath')}`)) {
        file.deleteRecord();
        this.get('notify').info(`File ${file.get('filePath')} was deleted`);
        this._removeFileFromColumns(file);
        if (this.get('activeFile') === file) {
          this.setProperties({
            activeFile: null,
            activeEditorCol: null
          });
        }

        this._updateOpenFiles();
        this.send('contentsChanged');
      }
    },

    removeColumn (col) {
      let numColumns = this.get('realNumColumns');

      for (var i = (col|0); i < numColumns; ++i) {
        this.setColumnFile(i, this.getColumnFile(i + 1));
      }
      this.setColumnFile(numColumns, undefined);

      let activeCol = this.get('activeEditorCol');
      if (activeCol >= col) {
        this.set('activeEditorCol', ((activeCol|0) - 1).toString());
      }

      this._updateOpenFiles();
      this.transitionToRoute({queryParams: {numColumns: numColumns - 1}});
    },

    addColumn() {
      let numColumns = this.get('realNumColumns');

      this.transitionToRoute({
        queryParams: {
          numColumns: numColumns + 1
        }
      }).then(() => {
        this.initializeColumns();
        this._updateOpenFiles();
      });
    },

    updateColumn(isUserChange) {
      if(isUserChange) {
        this.send('contentsChanged');
      }
    },

    exitFullScreen() {
      this.transitionToRoute({
        queryParams: {
          fullScreen: false
        }
      }).then(() => {
        this.initializeColumns();
        this._updateOpenFiles();
      });
    },

    setEditorKeyMap (keyMap) {
      const settings = this.get('settings');
      settings.set('keyMap', keyMap);
      settings.save();
    }
  },

  _removeFileFromColumns (file) {
    for (let i = 1; i <= MAX_COLUMNS; ++i) {
      if (this.getColumnFile(i) === file) {
        this.setColumnFile(i, null);
      }
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
            if (window.messagesWaiting > 0) {
              window.messagesWaiting = 0;
            }
            const newRoute = m.data.setDemoAppUrl || '/';
            this.setProperties({
              applicationUrl: newRoute,
              route: newRoute === "/" ? undefined : newRoute
            });
          }
        }
      });
    });
  }
});
