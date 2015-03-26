import Ember from 'ember';

export default Em.Route.extend({
  github: Ember.inject.service('github'),

  beforeModel () {
    var session = this.get('session');

    return session.fetch('github-oauth2').catch(function() {
      // Swallow error for now
    });
  },

  model () {
    return this.get('github').createGist({
      files: [
        {name: 'application.hbs', content:
          "Welcome to EmberTwiddle! {{foo}} {{outlet}}"
        },
        {name: 'index.hbs', content:
          "Index is: {{bar}}"
        },
        {name: 'application/controller.js', content:
          "export default Em.Controller.extend({foo: 'foo'});"
        },
        {name: 'controllers/index.js', content:
          "export default Em.Controller.extend({bar: 'bar'});"
        }
      ]
    });
  },

  actions: {
    signInViaGithub () {
      this.get('session').open('github-oauth2').catch(function(error) {
        alert('Could not sign you in: ' + error.message);
      });
    }
  }
});