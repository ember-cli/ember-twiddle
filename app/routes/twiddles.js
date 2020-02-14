import Route from '@ember/routing/route';
import config from '../config/environment';

export default Route.extend({
  titleToken: 'My Saved Twiddles',
  toriiProvider: config.toriiProvider,

  beforeModel() {
    return this.session.fetch(this.get('toriiProvider')).catch(error => {
      if (!error) {
        this.transitionTo('/');
      }
    });
  },

  model() {
    return this.get('store').query('gist', {
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
