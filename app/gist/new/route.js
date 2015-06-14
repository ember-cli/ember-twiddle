import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  model () {
    var fork = this.controllerFor('gist').get('fork');
    if(fork) {
      this.controllerFor('gist').set('fork', null);
      return fork;
    }

    this.store.unloadAll('gistFile');

    var model = this.store.createRecord('gist', {description: 'New Twiddle'});
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'templates/application.hbs',
      content: '<h1>Welcome to {{appName}}</h1><br><br>',
    }));
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'controllers/application.js',
      content: 'import Ember from \'ember\';\n\nexport default Ember.Controller.extend({\n  appName:\'Ember Twiddle\'\n});',
    }));

    return model;
  }
});
