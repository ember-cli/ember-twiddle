import Ember from 'ember';

export default Ember.Route.extend({
  setupController (controller, context) {
    let gistController = this.controllerFor('gist');
    gistController.set('model', context);
    gistController.get('emberCli').setup(context);
    gistController.clearColumns();
    gistController.initializeColumns();
    gistController.get('rebuildApp').perform();
  }
});
