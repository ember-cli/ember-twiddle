import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    files: { embedded: 'always' },
    history: { deserialize: 'records', serialize: false },
  },

  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    this.normalizeFiles(payload);
    this.normalizeHistory(payload);
    payload.owner_login = payload.owner.login;
    return this._super(store, primaryModelClass, payload, id, requestType);
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
        record.set('id', changedAttrs.fileName[1]);
      }

      filesJson[fileKey] = {
        filename: fileSnapshot.attr('fileName'),
        content: fileSnapshot.attr('content'),
        type: fileSnapshot.attr('fileType'),
      };
    });

    json[key] = filesJson;
  },

  // Not implemented yet.
  normalizeHistory (payload) {
    for(var i=0; i<payload.history.length; i++) {
      payload.history[i].id = payload.history[i].version;
      payload.history[i].short_id = payload.history[i].version.substring(0,7);
      delete payload.history[i].version;
    }
  },

  serializeHasMany: function(snapshot, json, relationship) {
    if(relationship.key === 'files') {
      this.serializeFiles(snapshot, json, relationship);
    }
    else {
      this._super.apply(this, arguments);
    }
  },
});
