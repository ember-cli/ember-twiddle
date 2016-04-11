import Ember from "ember";
import ErrorMessages from "../utils/error-messages";

export default Ember.Mixin.create({
  hasPath(filePath) {
    const files = this.get('model.files');
    const file = files.findBy('filePath', filePath);
    return file !== undefined;
  },

  createFile(filePath, fileProperties, fileColumn=1) {
    if (filePath) {
      if(this.hasPath(filePath)) {
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
      this.updateOpenFiles();
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
      window.alert(errorMsg);
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
    this.updateOpenFiles();
  },

  addFile(type) {
    let fileProperties = type ? this.get('emberCli').buildProperties(type) : {filePath:'file.js'};
    let filePath = fileProperties.filePath;

    if (['twiddle.json','router', 'css'].indexOf(type)===-1) {
      filePath = prompt('File path', filePath);
    }
    if (this.isPathInvalid(type, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
    this.updateOpenFiles();
  },

  renameFile(file) {
    let filePath = prompt('File path', file.get('filePath'));
    if (filePath) {
      if(this.get('model.files').findBy('filePath', filePath)) {
        alert(`A file with the name ${filePath} already exists`);
        return;
      }

      file.set('filePath', filePath);
      this.get('notify').info(`File ${file.get('filePath')} was added`);
      this.updateOpenFiles();
    }
  },

  removeFile(file) {
    file.deleteRecord();
    this.get('notify').info(`File ${file.get('filePath')} was deleted`);
    this.removeFileFromColumns(file);
    if (this.get('activeFile') === file) {
      this.setProperties({
        activeFile: null,
        activeEditorCol: null
      });
    }

    this.updateOpenFiles();
    this.send('contentsChanged');
  },

  addComponent(path) {
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
