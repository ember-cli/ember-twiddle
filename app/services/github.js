import Ember from 'ember';

export default Ember.Object.extend({
  _token: null,

  setToken (token) {
    this.set('_token', token);
  },

  find (url) {
    return this.apiCall(url, 'get');
  },

  create (url) {
    return this.apiCall(url, 'post');
  },

	apiCall (url, method) {
    var token = this.get('_token');

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        url: 'https://api.github.com' + url,
        dataType: 'json',
        method: method,
        headers: {
        	'Authorization': 'token ' + token
        },
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      });
    });
	}
});