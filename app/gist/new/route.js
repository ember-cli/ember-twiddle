import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  model () {
    var model = this.store.createRecord('gist', {description: 'Twiddle'});
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'templates/application.hbs',
      content: 'Demo :-)',
    }));
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'controllers/application.js',
      content: 'export default Ember.Controller.extend({});',
    }));

    return model;
  }
});
