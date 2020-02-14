import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

const CONFIRM_MSG = "Unsaved changes will be lost. Are you sure?";

export default Route.extend({
  emberCli: service(),

  afterModel(context) {
    return this.get('emberCli').setup(context);
  },

  setupController(controller, context) {
    this._super(controller, context);

    const gistController = this.controllerFor('gist');
    gistController.set('model', context);
  },

  actions: {
    willTransition(transition) {
      const gistController = this.controllerFor('gist');
      if (gistController.get('unsaved') === true) {
        if (!window.confirm(CONFIRM_MSG)) {
          transition.abort();
        }
      } else {
        return true;
      }
    },

    showRevision() {},
    showCurrentVersion() {},
    signInViaGithub() {
      this.send('signInWithGithub');
    }
  }
});
