import File from './file';

var Gist = Em.Object.extend({
  github: Em.inject.service('github'),
  id: null,

  isNew: Em.computed(() => {
    return this.get('id')===null;
  }),

  addFile (filePath) {
    this.get('files').pushObject(File.create({
      path: filePath
    }));
  },

  /**
   * Saves the current gist
   * @return Promise
   */
  save () {
    return this.get('isNew') ? this.github.postGist(this) : this.github.patchGist(this);
  },
});

Gist.reopenClass({
  build () {

  },

  deserialize (payload) {
    var model = Gist.create({
      id: payload.id,
      description: payload.description,
      files: []
    });

    for (var fileName in payload.files) {
      model.get('files').pushObject(this.deserializeFile(fileName, payload.files[fileName].content));
    }

    return model;
  },

  deserializeFile (fileName, fileContent) {
    return File.create({
      content: fileContent,
      name: this.deserializeFileName(fileName)
    });
  },

  deserializeFileName (fileName) {
    var parts = fileName.split('.');
    return parts.slice(0,-1).join('/') + '.' + parts.slice(-1);
  },

  serializeFileName (fileName) {
    return fileName.replace(/\//gi, '.');
  },

  serialize (gist) {
    return JSON.stringify(gist);
  }
});

export default Gist;