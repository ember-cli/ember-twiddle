import config from '../config/environment';
import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Object.extend({
  github: Ember.inject.service('github'),

  /**
   * Resolve the user over the Github API using the token
   * @param  token      API token (either from Cookie or Oauth)
   * @return Promise
   */
  resolveUser (token) {
    var github = this.get('github');

    github.setToken(token);

    return github.request('/user', 'get').then((user) => {
      return this.persistToCookie(token).then(() => {
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
    return new Ember.RSVP.Promise((resolve, reject) => {
      var token = this.loadFromCookie();
      if(token) { resolve(token); } else {reject();}
    }).then((token) => {
      return this.resolveUser(token);
    });
  },

  /**
   * Open a new session, authenticate with Github
   * @return Promise
   */
  open (authorization) {
    return ajax({
      url: config.githubOauthUrl + authorization.authorizationCode,
      dataType: 'json',
    }).then((data) => {
      return this.resolveUser(data.token);
    });
  }
});