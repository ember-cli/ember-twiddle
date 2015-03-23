export default Ember.Object.extend({
	github: Ember.inject.service('github'),

	fetch () {
		var cookie = this.get('cookie');
		return new Ember.RSVP.Promise(function(resolve, reject){
			if(cookie.getCookie('gh_user')) {
				return resolve({currentUser: JSON.parse(cookie.getCookie('gh_user'))});
			}
			reject(null);
		});
	},

  open (authorization) {
  	var cookie = this.get('cookie'),
        github = this.get('github');

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        url: 'http://localhost:9999/authenticate/' + authorization.authorizationCode,
        dataType: 'json',
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      });
    }).then(function(data){
      return github.apiCall('/user', data.token).then(function(user) {
      	user.token = data.token;
      	return cookie.setCookie('gh_user', JSON.stringify(user)).then(function() {
      		return {currentUser: user};	
      	});
      })
    });
  }
});