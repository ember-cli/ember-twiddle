import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  titleToken: 'My Saved Twiddles',
  torriProvider: config.torriProvider,
  beforeModel() {
    return this.session.fetch(this.get('torriProvider')).catch(error => {
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
    signOut: function() {
      this.session.close().then(() => {
        this.transitionTo('/');
      });
    }
  }
});
