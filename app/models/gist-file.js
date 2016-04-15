import DS from 'ember-data';
import Ember from 'ember';
import Path from 'npm:path';

const { attr, belongsTo } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  fileType: attr('string'),
  fileName: attr('string'),
  content: attr('string'),
  gist: belongsTo('gist', { async: false }),

  /*
    Replace dots with slashes, Gists can't have directories
   */
  filePath: computed('fileName', {
    get() {
      var fileName = this.get('fileName') || '';
      var parts = fileName.split('.');
      return parts.slice(0, -1).join('/') + '.' + parts.slice(-1);
    },

    set(key, value) {
      this.set('fileName', value.replace(/\//gi, '.'));
      return value;
    }
  }),

  extension: computed('filePath', function () {
    return Path.extname(this.get('filePath'));
  }),

  /**
    We need to register deletes.
   */
  deleteRecord() {
    this._super(...arguments);
    const gist = this.get('gist');
    if(gist) {
      gist.registerDeletedFile(this.get('id'));

      // Following should not be necessary. Bug in ember data?
      try {
        gist.get('files').removeObject(this);
      } catch(e) {}
    }
  }
});
