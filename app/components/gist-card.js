import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Component.extend({
  session: inject.service(),
  classNames: ['gist-card'],

  // show fork option only if does not belong to user and is not a revision, otherwise show copy
  // Github api does not permit forking if you own the gist already
  // Github does not provide api for forking a revision
  showFork: computed('gist.ownerLogin', 'session.currentUser.login', 'isRevision', function() {
    return !this.get('isRevision') && this.get('gist.ownerLogin') !== this.get('session.currentUser.login');
  }),
});
