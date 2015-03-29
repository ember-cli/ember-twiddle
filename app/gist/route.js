import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel () {
    var session = this.get('session');

    return session.fetch('github-oauth2').catch(function() {
      // Swallow error for now
    });
  },

  actions: {
    saveGist (gist) {
      this.get('github').saveGist(gist);
    },

    signInViaGithub () {
      this.get('session').open('github-oauth2').catch(function(error) {
        alert('Could not sign you in: ' + error.message);
        throw error;
      });
    }
  }
});