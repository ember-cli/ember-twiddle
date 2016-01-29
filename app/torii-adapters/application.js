import config from '../config/environment';
import Ember from 'ember';
import ajax from 'ember-ajax';

export default Ember.Object.extend({  /**
   * Resolve the user over the Github API using the token
   * @param  token      API token (either from Cookie or Oauth)
   * @return Promise
   */
  resolveUser (token) {
    config.TMP_TORII_TOKEN = token;
    return this.get('store').find('user', 'current').then((user) => {
      config.TMP_TORII_TOKEN = null;
      localStorage.setItem('fiddle_gh_session', token);
      return { currentUser: user, token: token };
    });
  },

  /**
   * Try loading the user from cookie
   * @return Promise
   */
  fetch () {
    var token = localStorage.getItem('fiddle_gh_session');

    if(Ember.isBlank(token)) { return Ember.RSVP.reject(); }

    return this.resolveUser(token);
  },

  /**
   * Open a new session, authenticate with Github
   * @return Promise
   */
  open (authorization) {
    return ajax({
      url: config.githubOauthUrl + authorization.authorizationCode,
      dataType: 'json',
    }).then(result => this.resolveUser(result.token));
  },


  /**
   * Close a session
   * @return Promise
   */
  close () {
    localStorage.removeItem('fiddle_gh_session');
    return Ember.RSVP.resolve();
  }
});
