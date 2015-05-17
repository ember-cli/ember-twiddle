import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  model () {
    this.store.unloadAll('gistFile');

    var model = this.store.createRecord('gist', {description: 'New Twiddle'});
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'templates/application.hbs',
      content: '<h1>Welcome to {{appName}}</h1><br><br>',
    }));
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'controllers/application.js',
      content: 'export default Ember.Controller.extend({\n  appName:\'Ember Twiddle\'\n});',
    }));

    return model;
  }
});
