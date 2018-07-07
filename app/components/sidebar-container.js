import Ember from 'ember';

const { inject } = Ember;

export default Ember.Component.extend({
  state: inject.service(),
  router: inject.service(),

  classNames: ['sidebar-container'],
  sidenavLockedOpen: 'gt-sm',

  actions: {
    hideProfile() {
      let lastGistId = this.get('state.lastGistId');
      let params = lastGistId ? ['gist.edit', lastGistId] : ['gist'];
 
      this.get('router').transitionTo(...params).then(() => {
        this.set('showProfile', false);
      });
    }
  }
});
