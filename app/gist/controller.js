import TwiddleResolver from "ember-twiddle/lib/twiddle-resolver";
import File from "ember-twiddle/lib/file";

export default Em.Controller.extend({
  // contentObserver: Em.observer('model.files.@each.compiled', function () {
  //   Em.run.debounce(this, 'setupApplication', 500);
  // }.on('init')),

  // setupApplication () {
  //   if(this.currentApp) {
  //     Em.run(this.currentApp, 'destroy');
  //   }

  //   var App = Em.Application.create({
  //     name:         "App",
  //     rootElement:  '#demo-app',
  //     modulePrefix: 'demo-app',
  //     Resolver:     TwiddleResolver.extend({files: this.get('model.files')})
  //   });

  //   this.currentApp = App;
  // },

  // actions: {
  //   addFile () {
  //     this.get('model.files').pushObject(File.create());
  //   },

  //   removeFile (file) {
  //     this.get('model.files').removeObject(file);
  //   }
  // }
});