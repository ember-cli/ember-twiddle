import TwiddleResolver from "ember-twiddle/lib/twiddle-resolver";

export default Em.Controller.extend({
  contentObserver: Em.observer('model.files.@each.compiled', function () {
    Em.run.debounce(this, 'setupApplication', 500);
  }.on('init')),

  setupApplication () {
    if(this.currentApp) {
      Em.run(this.currentApp, 'destroy');
    }

    this.currentApp = Em.Application.create({
      name:         "App",
      rootElement:  '#demo-app',
      modulePrefix: 'demo-app',
      Resolver:     TwiddleResolver.extend({files: this.get('model.files')})
    });
  },

  templateFiles: Em.computed('model.files.length', 'model.files.@each.fileName', function() {
    return this.get('model.files').filter(item => {
      return item.get('fileName').indexOf('hbs')!==-1;
    }).sortBy('fileName');  }),

  jsFiles: Em.computed('model.files.length', 'model.files.@each.fileName', function() {
    return this.get('model.files').filter(item => {
      return item.get('fileName').indexOf('js')!==-1;
    }).sortBy('fileName');
  }),

  cssFiles: Em.computed('model.files.length', 'model.files.@each.fileName', function() {
    return this.get('model.files').filter(item => {
      return item.get('fileName').indexOf('css')!==-1;
    }).sortBy('fileName');
  }),

  actions: {
    addFile () {
      let fileName = prompt('File name');
      if (fileName) {this.get('model').addFile(fileName);}
    },

    removeFile (file) {
      if(confirm(`Are you sure you want to remove this file?\n\n${file.get('name')}`)) {
        this.get('model').removeFile(file);
      }
    }
  }
});