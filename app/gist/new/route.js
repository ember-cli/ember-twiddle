export default Em.Route.extend({
  github: Em.inject.service('github'),
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
  }
});
