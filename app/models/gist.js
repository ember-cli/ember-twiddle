import DS from 'ember-data';
import { memberAction } from 'ember-api-actions';

export default DS.Model.extend({
  url: DS.attr('string'),
  description: DS.attr('string'),
  htmlUrl: DS.attr('string'),
  files: DS.hasMany('gistFile', {async:false}),
  history: DS.hasMany('gistRevision', {async:false}),
  public: DS.attr('boolean', {defaultValue: true}),
  currentRevision: Em.computed.oneWay('history.firstObject.shortId'),
  shortId: Em.computed('id', function() {
    return (this.get('id')||'').substring(0,7);
  }),

  /**
   * Just call this action to fork
   * See https://developer.github.com/v3/gists/#fork-a-gist
   *
   * @return promise
   */
  fork: memberAction({ path: "forks", type: 'POST' }),

  /**
    Called by GistFile.registerDeleteOnGist to make sure we
    register deleted files on the server.
   */
  registerDeletedFile (fileId) {
    var deletedFiles = this.get('deletedFiles') || [];
    if(!this.get('isNew')) {
      deletedFiles.push(fileId);
      this.set('deletedFiles', deletedFiles);
    }
  },

  /**
    Make sure we don't delete files twice.
   */
  clearDeletedFiles: Em.on('didUpdate', function() {
    this.set('deletedFiles', null);
  })
});