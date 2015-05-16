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
    for(var i in payload.history) {
      payload.history[i].id = payload.history[i].version;
      delete payload.history[i].version;
    }
  },

  // Not implemented yet.
  serializeHistory () {

  },

  serializeHasMany: function(snapshot, json, relationship) {
    if(relationship.key === 'files') {
      this.serializeFiles(snapshot, json, relationship);
    }
    else if(relationship.key === 'history') {
      this.serializeHistory(snapshot, json, relationship);
    }
    else {
      this._super.apply(this, arguments);
    }
  },
});
