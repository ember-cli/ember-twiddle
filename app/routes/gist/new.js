import Ember from 'ember';
import GistRoute from "ember-twiddle/routes/gist-base-route";

const { inject, run } = Ember;

export default GistRoute.extend({
  emberCli: inject.service(),

  model(params) {
    let store = this.get('store');
    let model = store.createRecord('gist', {description: 'New Twiddle'});

    if (params.copyCurrentTwiddle) {
      store.peekAll('gistFile').setEach('gist', model);
    } else {
      store.unloadAll('gistFile');
      let files = model.get('files');
      let emberCli = this.get('emberCli');
      files.pushObject(emberCli.generate('controllers/application'));
      files.pushObject(emberCli.generate('templates/application'));
      files.pushObject(emberCli.generate('twiddle.json'));
    }

    return model;
  },

  setupController(controller) {
    this._super(...arguments);

    // reset copyCurrentTwiddle, so it is not shown in the URL: this QP is only
    // needed when initializing the model for this route
    controller.set('copyCurrentTwiddle', false);

    const gistController = this.controllerFor('gist');
    run.schedule('afterRender', function() {
      gistController.set('unsaved', false);
    });
  }
});
