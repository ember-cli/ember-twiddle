import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { isBlank } from '@ember/utils';
import RSVP from 'rsvp';
import config from '../config/environment';

export default EmberObject.extend({  /**
   * Resolve the user over the Github API using the token
   * @param  token      API token (either from Cookie or Oauth)
   * @return Promise
   */

  store: service(),
  ajax: service(),
  fastboot: service(),

  resolveUser(token) {
    config.TMP_TORII_TOKEN = token;
    return this.get('store').find('user', 'current').then((currentUser) => {
      config.TMP_TORII_TOKEN = null;
      if (!this.get('fastboot.isFastBoot')) {
        localStorage.setItem('fiddle_gh_session', token);
      }
      return { currentUser, token };
    });
  },

  /**
   * Try loading the user from cookie
   * @return Promise
   */
  fetch() {
    if (this.get('fastboot.isFastBoot')) {
      return RSVP.reject();
    }

    let token = localStorage.getItem('fiddle_gh_session');

    if (isBlank(token)) {
      return RSVP.reject();
    }

    return this.resolveUser(token);
  },

  /**
   * Open a new session, authenticate with Github
   * @return Promise
   */
  open(authorization) {
    let url = config.githubOauthUrl + authorization.authorizationCode;
    return this.get('ajax').request(url)
      .then(result => this.resolveUser(result.token));
  },


  /**
   * Close a session
   * @return Promise
   */
  close() {
    if (this.get('fastboot.isFastBoot')) {
      return RSVP.reject();
    } else {
      localStorage.removeItem('fiddle_gh_session');
      return RSVP.resolve();
    }
  }
});
