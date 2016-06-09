import DS from 'ember-data';
import Ember from 'ember';
import { memberAction } from 'ember-api-actions';

const { attr, hasMany } = DS;
const {
  computed,
  computed: { oneWay },
  on
} = Ember;

export default DS.Model.extend({
  url: attr('string'),
  description: attr('string'),
  htmlUrl: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  ownerLogin: attr('string'),
  files: hasMany('gistFile', { async: false }),
  history: hasMany('gistVersion', { async: false }),
  public: attr('boolean', { defaultValue: true }),

  currentRevision: oneWay('history.firstObject.shortId'),

  shortId: computed('id', function() {
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
    Called by GistFile.deleteRecord to make sure we
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
  clearDeletedFiles: on('didUpdate', function() {
    this.set('deletedFiles', null);
  })
});
