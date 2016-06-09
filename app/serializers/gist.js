import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    files: { embedded: 'always' },
    history: { embedded: 'always', deserialize: 'records', serialize: false }
  },

  init(...args) {
    this._super(...args);
    this.set('seq', 0);
  },

  normalizeSingleResponse: function(store, primaryModelClass, payload, id, requestType) {
    this.normalizeGist(payload, false);

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    payload.forEach(function(hash) {
      this.normalizeGist(hash, true);
    }.bind(this));

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  normalizeGist: function(payload, isArray) {
    this.normalizeFiles(payload, isArray);
    this.normalizeHistory(payload);
    if (payload.owner) {
      payload.owner_login = payload.owner.login;
    }
  },

  normalizeFiles (payload, isArray) {
    var normalizedFiles = [];

    for(var origName in payload.files) {
      let file = payload.files[origName];
      file.id = isArray ? this.incrementProperty('seq').toString() : origName;
      file.file_type = file.type;
      file.file_name = file.filename;

      delete file.type;
      delete file.filename;

      normalizedFiles.push(file);
    }

    payload.files = normalizedFiles;
  },

  serializeFiles (snapshot, json, relationship) {
    var files = snapshot.hasMany(relationship.key);
    var deletedFiles = snapshot.record.get('deletedFiles');
    var key = this.keyForRelationship(relationship.key);
    var filesJson = {};

    // Deleted files need to be given a null value
    if(deletedFiles) {
      deletedFiles.forEach((fileId) => {
        filesJson[fileId] = null;
      });
    }

    files.forEach((fileSnapshot) => {
      let fileKey = fileSnapshot.id;
      let record = fileSnapshot.record;
      let changedAttrs = record.changedAttributes();

      // If the name was changed, we need to update the ID
      // because the server will echo a different ID.
      if('fileName' in changedAttrs && changedAttrs.fileName[0]) {
        fileSnapshot.id = changedAttrs.fileName[1];
      }

      filesJson[fileKey] = {
        filename: fileSnapshot.attr('fileName'),
        content: fileSnapshot.attr('content'),
        type: fileSnapshot.attr('fileType')
      };
    });

    json[key] = filesJson;
  },

  normalizeHistory (payload) {
    if (payload.history) {
      for(var i=0; i<payload.history.length; i++) {
        let version = payload.history[i];
        version.id = version.version || version.id;
        version.short_id = version.id.substring(0,7);
        delete version.version;
      }
    }
  },

  serializeHasMany: function(snapshot, json, relationship) {
    if(relationship.key === 'files') {
      this.serializeFiles(snapshot, json, relationship);
    }
    else {
      this._super.apply(this, arguments);
    }
  }
});
