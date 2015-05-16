import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Object.extend({
  _token: null,

  setToken (token) {
    this.set('_token', token);
  },

  /**
   * Send a request to the github API
   * @param  {String} url
   * @param  {String} method
   * @param  {Object} payload
   * @return {Promise}
   */
  request (url, method, payload) {
    var token = this.get('_token');

    var options = {
      url: 'https://api.github.com' + url,
      dataType: 'json',
      method: method
    };

    if(payload) {
      options.data = payload;
      options.contentType = 'json';
    }

    if (token) {
      options.headers = {
        'Authorization': 'token ' + token
      };
    }
    return ajax(options);
  }
});