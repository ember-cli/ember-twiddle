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
    return this.get('store').findAll('gist');
  },

  actions: {
    signOut: function() {
      this.session.close().then(() => {
        this.transitionTo('/');
      });
    }
  }
});
