import Ember from 'ember';

export default Ember.Route.extend({
  afterModel (context) {
    const gistController = this.controllerFor('gist');
    return gistController.get('emberCli').setup(context);
  },

  setupController(controller, context) {
    this._super(controller, context);

    const gistController = this.controllerFor('gist');
    gistController.set('model', context);
    gistController.clearColumns();
    gistController.initializeColumns();
    gistController.get('rebuildApp').perform();
  }
});
