import config from '../config/environment';
import Ember from 'ember';

export default Ember.Object.extend({
	github: Ember.inject.service('github'),

  /**
   * Resolve the user over the Github API using the token
   * @param  token      API token (either from Cookie or Oauth)
   * @return Promise
   */
  resolveUser (token) {
    var self = this,
        github = this.get('github');

    github.setToken(token);

    return github.find('/user').then(function(user) {
      return self.persistToCookie(token).then(function() {
        return {currentUser: user};
      });
    });
  },

  persistToCookie (token) {
    var cookie = this.get('cookie');

    return cookie.setCookie('fiddle_gh_session', token);
  },

  loadFromCookie () {
    var cookie = this.get('cookie');
    return cookie.getCookie('fiddle_gh_session');
  },

  /**
   * Try loading the user from cookie
   * @return Promise
   */
	fetch () {
    var self = this;

		return new Ember.RSVP.Promise(function(resolve, reject){
      var token = self.loadFromCookie();
			if(token) { resolve(token); } else {reject();}
		}).then(function(token) {
      return self.resolveUser(token);
    });
	},

  /**
   * Open a new session, authenticate with Github
   * @return Promise
   */
  open (authorization) {
  	var self = this;

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        url: config.githubOauthUrl + authorization.authorizationCode,
        dataType: 'json',
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      });
    }).then(function(data) {
      return self.resolveUser(data.token);
    });
  }
});