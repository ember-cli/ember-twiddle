import Ember from "ember";
import ErrorMessages from "../utils/error-messages";
import { pushDeletion } from "../utils/push-deletion";

const { inject, run } = Ember;

export default Ember.Mixin.create({
  notify: inject.service(),

  hasPath(filePath) {
    const files = this.get('model.files');
    const file = files.findBy('filePath', filePath);
    return file !== undefined;
  },

  createFile(filePath, fileProperties, fileColumn=1) {
    let notify = this.get('notify');

    if (filePath) {
      if (this.hasPath(filePath)) {
        notify.info(`A file with the name '${filePath}' already exists`);
        return;
      }

      fileProperties.filePath = filePath;

      let store = this.get('store');
      run(() => pushDeletion(store, 'gist-file', filePath));
      let file = store.createRecord('gistFile', fileProperties);

      this.get('model.files').pushObject(file);
      notify.info(`File '${file.get('filePath')}' was added`);
      this.setColumnFile(fileColumn, file);
      this.set('activeEditorCol', '1');
      this.send('contentsChanged');
      run.scheduleOnce('afterRender', this, this.updateOpenFiles);
    }
  },

  /*
   *  Test whether path is valid.  Presently only tests whether components are hyphenated.
   */
  isPathInvalid(type, path){
    let notify = this.get('notify');
    let errorMsg = null;

    if (/^component/.test(type)) {
      if (!/[^/]+-[^/]+(\/(component\.js|template\.hbs))?$/.test(path)) {
        errorMsg = ErrorMessages.componentsNeedHyphens;
      }
    }

    if (errorMsg) {
      notify.warning(errorMsg);
      return true;
    }

    return false;
  },

  updateOpenFiles() {
    const columns = this.get('columns');
    const fileNames = columns.map(column => column.get('file.fileName'));
    const openFiles = fileNames.join(",").replace(/^,|,$/g, '');
    this.set('openFiles', openFiles);
  },

  openFile(filePath) {
    let file = this.get('model.files').findBy('filePath', filePath);
    let activeCol = this.get('activeEditorCol') || '1';
    this.setColumnFile(activeCol, file);
    this.set('activeEditorCol', activeCol);
    this.set('activeFile', file);
    run.scheduleOnce('afterRender', this, this.updateOpenFiles);
  },

  addFile(type) {
    let filePath = 'file.js';
    let fileProperties = type ? this.get('emberCli').buildProperties(type) : { filePath };

    filePath = fileProperties.filePath;

    if (['twiddle.json','router', 'css'].indexOf(type)===-1) {
      filePath = prompt('File path', filePath);
    }
    if (this.isPathInvalid(type, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
    run.scheduleOnce('afterRender', this, this.updateOpenFiles);
  },

  renameFile(file, filePath) {
    let notify = this.get('notify');

    if (filePath) {
      if (this.get('model.files').findBy('filePath', filePath)) {
        notify.info(`A file with the name '${filePath}' already exists`);
        return;
      }

      file.set('filePath', filePath);
      this.get('notify').info(`File ${file.get('filePath')} was added`);
      run.scheduleOnce('afterRender', this, this.updateOpenFiles);
    }
  },

  removeFile(file) {
    let notify = this.get('notify');

    file.deleteRecord();
    notify.info(`File '${file.get('filePath')}' was deleted`);
    this.removeFileFromColumns(file);

    if (this.get('activeFile') === file) {
      this.setProperties({
        activeFile: null,
        activeEditorCol: null
      });
    }

    this.send('contentsChanged');
    run.scheduleOnce('afterRender', this, this.updateOpenFiles);
  },

  addComponent(path) {
    //strip file extension if present
    path = path.replace(/\.[^/.]+$/, "");

    if (this.isPathInvalid('component', path)) {
      return;
    }

    ['js', 'hbs'].forEach((fileExt, i) => {
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

  addHelper(type, filePath) {
    let splitFilePath = filePath.split('/');
    let file = splitFilePath[splitFilePath.length - 1];
    let name = file.replace('.js', '').camelize();

    let fileProperties = this.get('emberCli').buildProperties(type, {
      camelizedModuleName: name
    });

    if (this.isPathInvalid(type, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
  }
});
