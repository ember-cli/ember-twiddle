import Ember from 'ember';

export default Ember.Route.extend({
  setupController (controller, context) {
    const gistController = this.controllerFor('gist');
    gistController.get('emberCli').setup(context).then(() => {
      gistController.set('model', context);
      gistController.clearColumns();
      gistController.initializeColumns();
      gistController.get('rebuildApp').perform();
    });
  }
});
