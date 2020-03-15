import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { on } from '@ember/object/evented';
import Settings from '../models/settings';
import ColumnsMixin from "../mixins/columns";
import FilesMixin from "../mixins/files";
import TestFilesMixin from "../mixins/test-files";
import AppBuilderMixin from "../mixins/app-builder";
import { keyDown, EKMixin } from 'ember-keyboard';

export default Component.extend(AppBuilderMixin, ColumnsMixin, FilesMixin, TestFilesMixin, EKMixin, {
  emberCli: service(),
  dependencyResolver: service(),
  notify: service(),
  store: service(),

  numColumns: 1,
  fullScreen: false,
  openFiles: "",

  init() {
    this._super(...arguments);
    this.set('settings', Settings.create());
    this.createColumns();
    this.setProperties({
      activeEditorCol: '1',
      keyboardActivated: true
    });
  },

  // eslint-disable-next-line ember/no-on-calls-in-components
  onReloadCommand: on(keyDown('Enter+cmd'), function () {
    this.send('runNow');
  }),

  // eslint-disable-next-line ember/no-on-calls-in-components
  onSaveCommand: on(keyDown('cmd+KeyS'), function (event) {
    this.saveGist(this.model);
    this.send('runNow');
    event.preventDefault();
  }),

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

  testsEnabled: oneWay('emberCli.enableTesting'),

  /**
   * reinitialize component when the model has changed
   */
  didReceiveAttrs() {
    this._super(...arguments);

    const model = this.model;

    if (model !== this._oldModel) {
      this.clearColumns();
      this.initializeColumns();
      run(() => {
        this.rebuildApp.perform();
      });
    }

    this._oldModel = model;
  },

  actions: {
    addFileWithPrompt() {
      this.addFile(...arguments);
    },

    renameFileWithPrompt() {
      this.renameFile(...arguments);
    },

    contentsChanged() {
      this.set('unsaved', true);
      this.rebuildApp.perform();
    },

    versionSelected(dependency, version) {
      var gist = this.model;
      var emberCli = this.emberCli;

      emberCli.updateDependencyVersion(gist, dependency, version).then(() => {
        this.rebuildApp.perform();
      });
    },

    liveReloadChanged(isLiveReload) {
      this.set('isLiveReload', isLiveReload);
      this.rebuildApp.perform();
    },

    focusEditor (editor) {
      this.set('activeEditorCol', editor.get('col'));
      this.set('activeFile', editor.get('file'));
    },

    selectFile (file) {
      this.set('activeFile', file);
      run.scheduleOnce('afterRender', this, this.updateOpenFiles);
    },

    runNow () {
      this.buildApp.perform();
    },

    titleChanged() {
      this.set('unsaved', true);
      this.titleUpdated();
    },

    showFileTree() {
      this.set('fileTreeShown', true);
    },

    hideFileTree() {
      this.set('fileTreeShown', false);
    },

    addComponentWithPrompt() {
      const defaultPath = this.get('emberCli.usePods') ? 'my-component' : 'components/my-component';
      let path = prompt('Component path (without file extension)', defaultPath);
      if (isBlank(path)){
        return;
      }

      this.addComponent(path);
    },

    addHelperWithPrompt() {
      let type = 'helper';
      let fileProperties = this.emberCli.buildProperties(type);
      let filePath = prompt('File path', fileProperties.filePath);

      this.addHelper(type, filePath);
    },

    async addUnitTestFile(type) {
      await this.ensureTestingEnabled();
      this.createUnitTestFile(type);
    },

    async addIntegrationTestFile(type) {
      await this.ensureTestingEnabled();
      this.createIntegrationTestFile(type);
    },

    async addAcceptanceTestFile() {
      await this.ensureTestingEnabled();
      this.createAcceptanceTestFile();
    },

    removeFileWithConfirm(file) {
      if (confirm(`Are you sure you want to remove this file?\n\n${file.get('filePath')}`)) {
        this.removeFile(file);
      }
    },

    removeColumnAndTransition(col) {
      this.removeColumn(col);
      run.scheduleOnce('afterRender', this, this.updateOpenFiles);
      this.transitionQueryParams({numColumns: this.realNumColumns - 1});
    },

    addColumnAndTransition() {
      let numColumns = this.realNumColumns;

      this.transitionQueryParams({
        numColumns: numColumns + 1
      }).then((queryParams) => {
        this.setProperties(queryParams);
        this.initializeColumns();
        run.scheduleOnce('afterRender', this, this.updateOpenFiles);
      });
    },

    updateColumn(isUserChange, content) {
      if(isUserChange) {
        this.set('activeFile.content', content);
        this.send('contentsChanged');
      }
    },

    exitFullScreen() {
      this.transitionQueryParams({
        fullScreen: false
      }).then(() => {
        this.initializeColumns();
        run.scheduleOnce('afterRender', this, this.updateOpenFiles);
      });
    },

    setEditorKeyMap(keyMap) {
      const settings = this.settings;
      settings.set('keyMap', keyMap);
      settings.save();
    },

    switchTests(testsEnabled) {
      this.ensureTestHelperExists();
      this.ensureTestStartAppHelperExists();
      this.ensureTestDestroyAppHelperExists();

      this.emberCli.setTesting(this.model, testsEnabled);
      this.rebuildApp.perform();
    }
  }
});
