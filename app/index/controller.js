import TwiddleResolver from "ember-twiddle/lib/twiddle-resolver";
import File from "ember-twiddle/lib/file";

export default Em.Controller.extend({
  files: [
    File.create({name: 'application.hbs', content:
      "Welcome to EmberTwiddle! {{foo}} {{outlet}}"
    }),
    File.create({name: 'index.hbs', content:
      "Index is: {{bar}}"
    }),
    File.create({name: 'application/controller.js', content:
      "export default Em.Controller.extend({foo: 'foo'});"
    }),
    File.create({name: 'controllers/index.js', content:
      "export default Em.Controller.extend({bar: 'bar'});"
    })
  ],

  contentObserver: Em.observer('files.@each.compiled', function () {
    Em.run.debounce(this, 'setupApplication', 500);
  }.on('init')),

  setupApplication () {
    if(this.currentApp) {
      Em.run(this.currentApp, 'destroy');
    }

    var App = Em.Application.create({
      name:         "App",
      rootElement:  '#demo-app',
      modulePrefix: 'demo-app',
      Resolver:     TwiddleResolver.extend({files: this.get('files')})
    });

    this.currentApp = App;
  },

  actions: {
    addFile () {
      this.get('files').pushObject(File.create());
    }
  }
});