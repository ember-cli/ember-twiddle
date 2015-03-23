export default Ember.Object.extend({
  _token: null,

  setToken (token) {
    this.set('_token', token);
  },

	apiCall (url, token) {
		var token  = token || this.get('_token');

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        url: 'https://api.github.com' + url,
        dataType: 'json',
        headers: {
        	'Authorization': 'token ' + token
        },
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      });
    });
	}
});