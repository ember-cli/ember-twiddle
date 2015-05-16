import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    files: { embedded: 'always' },
    history: { embedded: 'always' },
  },

  normalizePayload: function(payload) {
    this.normalizeFiles(payload);
    this.normalizeHistory(payload);
    return payload;
  },

  normalizeFiles (payload) {
    var normalizedFiles = [];
    for(var origName in payload.files) {
      let file = payload.files[origName];
      file.id = origName;
      file.file_type = file.type;
      file.file_name = file.filename;
      delete file.type;
      delete file.filename;
      normalizedFiles.push(file);
    }
    payload.files = normalizedFiles;
  },

  normalizeHistory (payload) {
    for(var i in payload.history) {
      payload.history[i].id = payload.history[i].version;
      delete payload.history[i].version;
    }
  }
});
