import GistEditRoute from "../edit";

export default GistEditRoute.extend({

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

  setupController() {
    this._super(...arguments);

    const gistController = this.controllerFor('gist');
    gistController.set('isRevision', true);
  }
});
