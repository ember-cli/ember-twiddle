import GistEditRoute from "../edit";

export default GistEditRoute.extend({

  controllerName: 'gist',
  templateName: 'gist',

  model(params) {
    this.get('store').unloadAll('gistFile');
    const gistParams = this.paramsFor('gist.edit');

    return this.get('store').query('gist-revision', {
      gistId: gistParams.gistId,
      revId: params.revId
    }).then((response) => {
      return response.get('firstObject');
    });
  },

  setupController(...args) {
    this._super(...args);

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
