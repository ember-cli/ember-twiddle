import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'My Saved Twiddles',

  beforeModel() {
    return this.session.fetch('github-oauth2').catch(error => {
      if (!error) {
        this.transitionTo('/');
      }
    });
  },

  model() {
    return this.get('store').query('gist', { per_page: 100 });
  },

  actions: {
    signOut: function() {
      this.session.close().then(() => {
        this.transitionTo('/');
      });
    }
  }
});
