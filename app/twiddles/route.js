import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.session.fetch('github-oauth2').catch(error => {
      if (!error) {
        this.transitionTo('/');
      }
    });
  },

  model() {
    return this.store.findAll('gist');
  }
});
