import GistEditRoute from "../edit";

export default GistEditRoute.extend({

  templateName: 'gist',

  model(params) {
    this.get('store').unloadAll('gistFile');
    const gistParams = this.paramsFor('gist.edit');

    return this.get('store').queryRecord('gist-revision', {
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
      this.get('store').unloadAll('gistFile');
      this.store.find('gist', this.paramsFor('gist.edit').gistId).then((model) => {
        this.transitionTo('gist.edit', model);
      });
    }
  }
});
