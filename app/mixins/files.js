import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';
import ErrorMessages from "../utils/error-messages";
import { pushDeletion } from "../utils/push-deletion";

export default Mixin.create({
  hasPath(filePath) {
    const files = this.get('model.files');
    const file = files.findBy('filePath', filePath);
    return file !== undefined;
  },

  createFile(filePath, fileProperties, fileColumn=1) {
    if (filePath) {
      if (this.hasPath(filePath)) {
        alert(`A file with the name ${filePath} already exists`);
        return;
      }

      fileProperties.filePath = filePath;

      let store = this.store;
      run(() => pushDeletion(store, 'gist-file', filePath));
      let file = store.createRecord('gistFile', fileProperties);

      this.get('model.files').pushObject(file);
      this.notify.info(`File ${file.get('filePath')} was added`);
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
    let errorMsg = null;
    if (/^component/.test(type)) {
      if (!/[^/]+-[^/]+(\/(component\.js|template\.hbs))?$/.test(path)) {
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
    const columns = this.columns;
    const fileNames = columns.map(column => column.get('file.fileName'));
    const openFiles = fileNames.join(",").replace(/^,|,$/g, '');
    this.set('openFiles', openFiles);
  },

  openFile(filePath) {
    let file = this.get('model.files').findBy('filePath', filePath);
    let activeCol = this.activeEditorCol || '1';
    this.setColumnFile(activeCol, file);
    this.set('activeEditorCol', activeCol);
    this.set('activeFile', file);
    run.scheduleOnce('afterRender', this, this.updateOpenFiles);
  },

  async addFile(type) {
    let replacements = {};
    let isGlimmer = await this.emberCli.twiddleJson.hasAddon(this.model, '@glimmer/component');

    if (type === 'component-js') {
      replacements.importComponent = isGlimmer ?
        `import Component from '@glimmer/component';` :
        `import Component from '@ember/component';`;
      replacements.importTemplate = '';
      replacements.defaultExport = "class extends Component {\n}";
    }

    let fileProperties = type ? this.emberCli.buildProperties(type, replacements) : {filePath:'file.js'};
    let filePath = fileProperties.filePath;

    if (['twiddle.json','router', 'css'].indexOf(type)===-1) {
      filePath = prompt('File path', filePath);
    }
    if (!isGlimmer && this.isPathInvalid(type, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
    run.scheduleOnce('afterRender', this, this.updateOpenFiles);
  },

  renameFile(file) {
    let filePath = prompt('File path', file.get('filePath'));
    if (filePath) {
      if (this.get('model.files').findBy('filePath', filePath)) {
        alert(`A file with the name ${filePath} already exists`);
        return;
      }

      file.set('filePath', filePath);
      this.notify.info(`File ${file.get('filePath')} was added`);
      run.scheduleOnce('afterRender', this, this.updateOpenFiles);
    }
  },

  removeFile(file) {
    file.deleteRecord();
    this.notify.info(`File ${file.get('filePath')} was deleted`);
    this.removeFileFromColumns(file);
    if (this.activeFile === file) {
      this.setProperties({
        activeFile: null,
        activeEditorCol: null
      });
    }

    this.send('contentsChanged');
    run.scheduleOnce('afterRender', this, this.updateOpenFiles);
  },

  async addComponent(path) {
    //strip file extension if present
    path = path.replace(/\.[^/.]+$/, "");

    let isGlimmer = await this.emberCli.twiddleJson.hasAddon(this.model, '@glimmer/component');

    if (!isGlimmer && this.isPathInvalid('component', path)) {
      return;
    }

    ['js', 'hbs'].forEach((fileExt, i)=>{
      let replacements = {};
      if (fileExt === 'js') {
        replacements.importComponent = isGlimmer ?
          `import Component from '@glimmer/component';` :
          `import Component from '@ember/component';`;
        replacements.importTemplate = '';
        replacements.defaultExport = "class extends Component {\n}";
      }
      let fileProperties = this.emberCli.buildProperties(`component-${fileExt}`, replacements);
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

    let fileProperties = this.emberCli.buildProperties(type, {
      camelizedModuleName: name
    });

    if (this.isPathInvalid(type, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
  }
});
