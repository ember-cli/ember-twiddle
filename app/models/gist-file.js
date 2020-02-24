import DS from 'ember-data';
import Ember from 'ember';
import Path from 'path';

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
      var fileName = this.fileName || '';

      // If the file name has an escaped `.`, we're using the new version of path
      // encoding that supports multiple periods in a path.
      // If not, we assume the last period separates the file ending and the rest are `/`s.
      // Required for back compat.
      // Ref: https://github.com/ember-cli/ember-twiddle/issues/658
      var hasEscapedPeriod = /\\\./.test(fileName);
      if (hasEscapedPeriod) {
        return fileName.replace(/[^\\]\./gi, '/').replace(/\\\./gi, '.');
      }
      else {
        var parts = fileName.split('.');
        return parts.slice(0, -1).join('/') + '.' + parts.slice(-1);
      }
    },

    set(key, value) {
      this.set('fileName', value.replace(/\./gi, '\\.').replace(/\//gi, '.'));
      return value;
    }
  }),

  extension: computed('filePath', function () {
    return Path.extname(this.filePath);
  }),

  /**
    We need to register deletes.
   */
  deleteRecord() {
    this._super(...arguments);
    const gist = this.gist;
    if(gist) {
      gist.registerDeletedFile(this.id);

      // Following try/catch should not be necessary. Bug in ember data?
      try {
        gist.get('files').removeObject(this);
      } catch(e) {
        /* squash */
      }
    }
  }
});
