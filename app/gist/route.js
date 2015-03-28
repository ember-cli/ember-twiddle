import Ember from 'ember';

export default Em.Route.extend({
  github: Ember.inject.service('github'),

  beforeModel () {
    var session = this.get('session');

    return session.fetch('github-oauth2').catch(function() {
      // Swallow error for now
    });
  },

  actions: {
    signInViaGithub () {
      this.get('session').open('github-oauth2').catch(function(error) {
        alert('Could not sign you in: ' + error.message);
        throw error;
      });
    }
  }
});