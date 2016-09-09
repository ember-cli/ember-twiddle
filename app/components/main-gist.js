import Ember from "ember";
import Settings from '../models/settings';
import ColumnsMixin from "../mixins/columns";
import FilesMixin from "../mixins/files";
import TestFilesMixin from "../mixins/test-files";
import AppBuilderMixin from "../mixins/app-builder";

const { inject, computed } = Ember;

export default Ember.Component.extend(AppBuilderMixin, ColumnsMixin, FilesMixin, TestFilesMixin, {
  emberCli: inject.service('ember-cli'),
  dependencyResolver: inject.service(),
  notify: inject.service(),
  store: inject.service(),
  fastboot: inject.service(),

  numColumns: 1,
  fullScreen: false,
  openFiles: "",

  init() {
    this._super(...arguments);
    this.set('settings', Settings.create({
      isFastBoot: this.get('fastboot.isFastBoot')
    }));
    this.createColumns();
    this.set('activeEditorCol', '1');
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

  settings: null,

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
  fileTreeShown: true,

  testsEnabled: computed.oneWay('emberCli.enableTesting'),

  /**
   * reinitialize component when the model has changed
   */
  didReceiveAttrs() {
    this._super(...arguments);

    const model = this.get('model');

    if (model !== this._oldModel) {
      this.clearColumns();
      this.initializeColumns();
      Ember.run(() => {
        this.get('rebuildApp').perform();
      });
    }

    this._oldModel = model;
  },

  actions: {
    contentsChanged() {
      this.set('unsaved', true);
      this.get('rebuildApp').perform();
    },

    versionSelected: function(dependency, version) {
      var gist = this.get('model');
      var emberCli = this.get('emberCli');

      emberCli.updateDependencyVersion(gist, dependency, version).then(() => {
        this.get('rebuildApp').perform();
      });
    },

    liveReloadChanged(isLiveReload) {
      this.set('isLiveReload', isLiveReload);
      this.get('rebuildApp').perform();
    },

    focusEditor (editor) {
      this.set('activeEditorCol', editor.get('col'));
      this.set('activeFile', editor.get('file'));
    },

    selectFile (file) {
      this.set('activeFile', file);
      this.updateOpenFiles();
    },

    openFile(filePath) {
      this.openFile(filePath);
    },

    runNow () {
      this.get('buildApp').perform();
    },

    titleChanged() {
      this.set('unsaved', true);
      this.get('titleUpdated')();
    },

    showFileTree() {
      this.set('fileTreeShown', true);
    },

    hideFileTree() {
      this.set('fileTreeShown', false);
    },

    addComponent() {
      const defaultPath = this.get('emberCli.usePods') ? 'my-component' : 'components/my-component';
      let path = prompt('Component path (without file extension)', defaultPath);
      if (Ember.isBlank(path)){
        return;
      }

      this.addComponent(path);
    },

    addHelper() {
      let type = 'helper';
      let fileProperties = this.get('emberCli').buildProperties(type);
      let filePath = prompt('File path', fileProperties.filePath);

      this.addHelper(type, filePath);
    },

    addUnitTestFile(type) {
      this.ensureTestingEnabled().then(() => {
        this.createUnitTestFile(type);
      });
    },

    addIntegrationTestFile(type) {
      this.ensureTestingEnabled().then(() => {
        this.createIntegrationTestFile(type);
      });
    },

    addAcceptanceTestFile() {
      this.ensureTestingEnabled().then(() => {
        this.createAcceptanceTestFile();
      });
    },

    /**
     * Add a new file to the model
     * @param {String|null} type Blueprint name or null for empty file
     */
    addFile (type) {
      this.addFile(type);
    },

    renameFile (file) {
      this.renameFile(file);
    },

    removeFile (file) {
      if(confirm(`Are you sure you want to remove this file?\n\n${file.get('filePath')}`)) {
        this.removeFile(file);
      }
    },

    removeColumn (col) {
      this.removeColumn(col);
      this.updateOpenFiles();
      this.get('transitionQueryParams')({numColumns: this.get('realNumColumns') - 1});
    },

    addColumn() {
      let numColumns = this.get('realNumColumns');

      this.get('transitionQueryParams')({
        numColumns: numColumns + 1
      }).then((queryParams) => {
        this.setProperties(queryParams);
        this.initializeColumns();
        this.updateOpenFiles();
      });
    },

    updateColumn(isUserChange, content) {
      if(isUserChange) {
        this.set('activeFile.content', content);
        this.send('contentsChanged');
      }
    },

    exitFullScreen() {
      this.get('transitionQueryParams')({
        fullScreen: false
      }).then(() => {
        this.initializeColumns();
        this.updateOpenFiles();
      });
    },

    setEditorKeyMap (keyMap) {
      const settings = this.get('settings');
      settings.set('keyMap', keyMap);
      settings.save();
    },

    switchTests(testsEnabled) {
      this.ensureTestHelperExists();
      this.ensureTestResolverExists();
      this.ensureTestStartAppHelperExists();
      this.ensureTestDestroyAppHelperExists();

      this.get('emberCli').setTesting(this.get('model'), testsEnabled);
      this.get('rebuildApp').perform();
    }
  }
});
