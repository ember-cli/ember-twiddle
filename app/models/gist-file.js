import DS from 'ember-data';
import Ember from 'ember';
import Path from 'npm:path';

const { attr, belongsTo } = DS;
const { computed, observer } = Ember;

export default DS.Model.extend({
  fileType: attr('string'),
  fileName: attr('string'),
  content: attr('string'),
  gist: belongsTo('gist', { async: false }),

  /*
    Replace dots with slashes, Gists can't have directories
   */
  filePath: computed('fileName', function(key, value) {
    if(value) {
      this.set('fileName', value.replace(/\//gi, '.'));
    }

    var fileName = this.get('fileName');
    var parts = fileName.split('.');
    return parts.slice(0,-1).join('/') + '.' + parts.slice(-1);
  }),

  extension: computed('filePath', function () {
    return Path.extname(this.get('filePath'));
  }),

  /**
    We need to register deletes.
   */
  registerDeleteOnGist: observer('isDeleted', function() {
    if(!this.get('gist')) {
      return;
    }

    this.get('gist').registerDeletedFile(this.get('id'));
  })
});
