import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  model () {
    return this.github.createGist({
      files: [
        {
          name: 'app/application/template.hbs',content:
          "Welcome to EmberTwiddle! {{foo}} {{outlet}}"
        },
        {name: 'app/index/template.hbs', content:
          "Index is: {{bar}}"
        },
        {name: 'app/application/controller.js', content:
          "export default Em.Controller.extend({foo: 'foo'});"
        },
        {name: 'app/controllers/index.js', content:
          "export default Em.Controller.extend({bar: 'bar'});"
        }
      ]
    });
  }
});
