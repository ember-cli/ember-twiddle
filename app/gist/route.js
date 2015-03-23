export default Em.Route.extend({
  github: Ember.inject.service('github'),

  beforeModel () {
    var github = this.get('github'),
        session = this.get('session');

    return session.fetch('github-oauth2').then(function(user) {
      github.setToken(session.get('currentUser.token'));
    });
  },

  loadGists () {
    return this.get('github').apiCall('/gists')
  },

  actions: {
    signInViaGithub () {
      var self = this;

      this.get('session').open('github-oauth2').then(function(){
        self.loadGists();
      }, function(error) {
        alert('Could not sign you in: ' + error.message);
      });
    }
	}
});