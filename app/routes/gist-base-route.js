import Ember from 'ember';

export default Ember.Route.extend({
  setupController (controller, context) {
    let gistController = this.controllerFor('gist');
    gistController.set('model', context);
    gistController.initializeColumns();
    gistController.rebuildApp();
  }
});
