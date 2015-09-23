import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.session.fetch('github-oauth2').catch(function() {
      // Swallow error for now
    });
  },

  model() {
    return this.store.findAll('gist');
  }
});
