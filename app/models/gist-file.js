import Model, { belongsTo, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import Path from 'path';

export default Model.extend({
  fileType: attr('string'),
  fileName: attr('string'),
  content: attr('string'),
  gist: belongsTo('gist', { async: false }),

  /*
    Replace dots with slashes, Gists can't have directories
   */
  filePath: computed('fileName', {
    get() {
      let fileName = this.fileName || '';
      let filePath = '';

      // If the file name has an escaped `.`, we're using the new version of path
      // encoding that supports multiple periods in a path.
      // If not, we assume the last period separates the file ending and the rest are `/`s.
      // Required for back compat.
      // Ref: https://github.com/ember-cli/ember-twiddle/issues/658
      let hasEscapedPeriod = /\\\./.test(fileName);
      if (hasEscapedPeriod) {
        filePath = fileName.replace(/([^\\])\./gi, "$1/").replace(/\\\./gi, '.');
      }
      else {
        let parts = fileName.split('.');
        filePath = parts.slice(0, -1).join('/') + '.' + parts.slice(-1);
      }
      return filePath;
    },

    set(key, value) {
      let fileName = value.replace(/\./gi, '\\.').replace(/\//gi, '.');
      this.set('fileName', fileName);
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
