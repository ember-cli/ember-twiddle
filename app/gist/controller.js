import Ember from "ember";
import config from '../config/environment';
import Settings from '../models/settings';
import ErrorMessages from 'ember-twiddle/helpers/error-messages';
import Column from '../utils/column';
import _ from 'lodash/lodash';

const {
  computed,
  run
} = Ember;

const MAX_COLUMNS = 3;

export default Ember.Controller.extend({
  emberCli: Ember.inject.service('ember-cli'),
  version: config.APP.version,

  queryParams: ['numColumns', 'fullScreen'],
  numColumns: 2,
  fullScreen: false,

  init() {
    this._super(...arguments);
    this.createColumns();
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
   * Set the initial files in the columns
   */
  initializeColumns() {
    let files = this.get('model.files');
    let numColumns = this.get('realNumColumns');

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
        alert('A file with the name %@ already exists'.fmt(filePath));
        return;
      }

      fileProperties.filePath = filePath;
      let file = this.store.createRecord('gistFile', fileProperties);

      this.get('model.files').pushObject(file);
      this.notify.info('File %@ was added'.fmt(file.get('filePath')));
      this.setColumnFile(fileColumn, file);
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

    openFile(filePath) {
      let file = this.get('model.files').findBy('filePath', filePath);
      this.setColumnFile(1, file);
      this.set('activeEditorCol', '1');
      this.set('activeFile', file);
    },

    runNow () {
      this.buildApp();
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
      ['js', 'hbs'].forEach((fileExt, i)=>{
        let fileProperties = this.get('emberCli').buildProperties(`component-${fileExt}`);
        let filePath =  `${fileExt === 'hbs' ? 'templates/' : ''}${path}.${fileExt}`;
        let fileColumn = i+1;
        this.createFile(filePath, fileProperties, fileColumn);
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
        if (this.get('activeFile') === file) {
          this.setProperties({
            activeFile: null,
            activeEditorCol: null
          });
        }

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

      this.transitionToRoute({queryParams: {numColumns: numColumns - 1}});
    },

    addColumn() {
      let numColumns = this.get('realNumColumns');

      this.transitionToRoute({
        queryParams: {
          numColumns: numColumns + 1
        }
      }).then(this.initializeColumns.bind(this));
    },

    exitFullScreen() {
      this.transitionToRoute({
        queryParams: {
          fullScreen: false
        }
      }).then(this.initializeColumns.bind(this));
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
            this.set('applicationUrl', m.data.setDemoAppUrl || '/');
          }
        }
      });
    });
  }
});
