import File from './file';

export default Em.Object.extend({
  id: null,

  isNew: Em.computed(function () {
    return this.get('id')===null;
  }),

  addFile (filePath) {
    this.get('files').pushObject(File.create({
      path: filePath
    }));
  },

  serialize () {
    var json = {files:{}, description:'twiddle', public:true};

    this.get('files').forEach(file => {
      json.files[this.serializeFileName(file.get('name'))] = {
        content: file.get('content')
      };
    });

    return JSON.stringify(json);
  },

  serializeFileName (fileName) {
    return fileName.replace(/\//gi, '.');
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

  deserialize (payload) {
    var model = this.create({
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
  }
});