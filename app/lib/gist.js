import File from './file';

export default Em.Object.extend({
  id: null,

  isNew: Em.computed('id', function () {
    return this.get('id')===null;
  }),

  shortRevision: Em.computed('revision', function () {
    return (this.get('revision')||'').substring(0,7);
  }),

  addFile (fileName) {
    this.get('files').pushObject(File.create({
      name: fileName
    }));
  },

  removeFile (file) {
    this.get('deletedFiles').pushObject(file);
    this.get('files').removeObject(file);
  },

  serialize () {
    var json = {
      files: {},
      public: true
    };

    this.get('files').forEach(file => {
      json.files[file.get('nameKey')] = this.serializeFile(file);
    });

    this.get('deletedFiles').forEach(file => {
      json.files[file.get('nameKey')] = null;
    });

    return JSON.stringify(json);
  },

  serializeFileName (fileName) {
    return fileName.replace(/\//gi, '.');
  },

  serializeFile (file) {
    return {
      filename: this.serializeFileName(file.get('name')),
      content: file.get('content')
    };
  }
}).reopenClass({
  build (attrs) {
    var model = this.create({
      files: []
    });

    if (attrs.files) {
      attrs.files.forEach((file) => {
        model.get('files').pushObject(File.create(file));
      });
    }

    return model;
  },

  deserialize (payload, model) {
    if(!payload.public) {
      throw new Error('Private Gists are not supported at this point');
    }

    model = model || this.create({});

    model.setProperties({
      id: payload.id,
      revision: payload.history[0].version,
      url: payload.html_url,
      files: [],
      deletedFiles: []
    });

    this.deserializeFiles(model, payload.files);

    return model;
  },

  deserializeFiles (gist, filesPayload) {
    for (var fileName in filesPayload) {
      gist.get('files').pushObject(this.deserializeFile(fileName, filesPayload[fileName].content, gist));
    }
  },

  deserializeFile (fileName, fileContent, gist) {
    return File.create({
      gist: gist,
      nameKey: fileName,
      content: fileContent,
      name: this.deserializeFileName(fileName)
    });
  },

  deserializeFileName (fileName) {
    var parts = fileName.split('.');
    return parts.slice(0,-1).join('/') + '.' + parts.slice(-1);
  }
});