import Ember from 'ember';
import GistEditRoute from "../edit";
import { pushDeleteAll } from "ember-twiddle/utils/push-deletion";

const { run } = Ember;

export default GistEditRoute.extend({

  templateName: 'gist',

  model(params) {
    let store = this.store;
    run(() => pushDeleteAll(store, 'gist-file'));
    const gistParams = this.paramsFor('gist.edit');

    return store.queryRecord('gist-revision', {
      gistId: gistParams.gistId,
      revId: params.revId
    });
  },

  setupController() {
    this._super(...arguments);

    const gistController = this.controllerFor('gist');
    gistController.set('isRevision', true);
  },

  actions: {
    showCurrentVersion() {
      const store = this.store;
      run(() => pushDeleteAll(store, 'gist-file'));
      store.find('gist', this.paramsFor('gist.edit').gistId).then((model) => {
        this.transitionTo('gist.edit', model);
      });
    }
  }
});
