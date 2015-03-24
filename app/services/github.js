import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Object.extend({
  _token: null,

  setToken (token) {
    this.set('_token', token);
  },

  find (url) {
    return this.request(url, 'get');
  },

  create (url) {
    return this.request(url, 'post');
  },

  request (url, method) {
    var token = this.get('_token');

    return ajax({
      url: 'https://api.github.com' + url,
      dataType: 'json',
      method: method,
      headers: {
        'Authorization': 'token ' + token
      },
    });
  }
});