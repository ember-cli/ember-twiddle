import DS from 'ember-data';
import Path from 'npm:path';

export default DS.Model.extend({
  fileType: DS.attr('string'),
  fileName: DS.attr('string'),
  content: DS.attr('string'),
  gist: DS.belongsTo('gist', {async:false}),

  /*
    Replace dots with slashes, Gists can't have directories
   */
  filePath: Em.computed('fileName', function(key, value) {
    if(value) {
      this.set('fileName', value.replace(/\//gi, '.'));
    }

    var fileName = this.get('fileName');
    var parts = fileName.split('.');
    return parts.slice(0,-1).join('/') + '.' + parts.slice(-1);
  }),

  extension: Em.computed('filePath', function () {
    return Path.extname(this.get('filePath'));
  }),

  /**
    We need to register deletes.
   */
  registerDeleteOnGist: Em.observer('isDeleted', function() {
    if(!this.get('gist')) {
      return;
    }

    this.get('gist').registerDeletedFile(this.get('id'));
  })
});