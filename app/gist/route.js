import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel () {
    return this.session.fetch('github-oauth2').catch(function() {
      // Swallow error for now
    });
  },

  actions: {
    saveGist (gist) {
      var newGist = gist.get('isNew');
      this.github.saveGist(gist).then(() => {
        if(newGist) {
          this.transitionTo('gist.edit', gist);
        }
      });
    },

    signInViaGithub () {
      this.session.open('github-oauth2').catch(function(error) {
        alert('Could not sign you in: ' + error.message);
        throw error;
      });
    },

    signOut () {
      this.session.close();
    }
  }
});