import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  titleToken: 'My Saved Twiddles',
  toriiProvider: config.toriiProvider,

  beforeModel() {
    return this.session.fetch(this.toriiProvider).catch(error => {
      if (!error) {
        this.transitionTo('/');
      }
    });
  },

  model() {
    return this.store.query('gist', {
      user: this.get('session.currentUser.login'),
      per_page: 100
    });
  },

  actions: {
    signOut() {
      this.session.close().then(() => {
        this.transitionTo('/');
      });
    },
    signInViaGithub() {}
  }
});
