import Ember from 'ember';

const CONFIRM_MSG = "Unsaved changes will be lost. Are you sure?";

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
  },

  actions: {
    willTransition(transition) {
      const gistController = this.controllerFor('gist');
      if (gistController.get('unsaved')) {
        if (!window.confirm(CONFIRM_MSG)) {
          transition.abort();
        }
      } else {
        return true;
      }
    }
  }
});
