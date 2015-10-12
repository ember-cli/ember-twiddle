import Ember from 'ember';
import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  emberCli: Ember.inject.service('ember-cli'),

  model (params) {
    var model = this.store.createRecord('gist', {description: 'New Twiddle'});

    if (params.copyCurrentTwiddle) {
      this.store.peekAll('gistFile').setEach('gist', model);
    } else {
      this.store.unloadAll('gistFile');

      model.get('files').pushObject(this.get('emberCli').generate('controllers/application'));
      model.get('files').pushObject(this.get('emberCli').generate('templates/application'));
      model.get('files').pushObject(this.get('emberCli').generate('twiddle.json'));
    }

    return model;
  },

  setupController() {
    this._super.apply(this, arguments);

    this.controllerFor('gist').set('unsaved', true);
  }
});
