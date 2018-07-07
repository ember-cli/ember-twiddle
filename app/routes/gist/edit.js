import Ember from "ember";
import GistRoute from "ember-twiddle/routes/gist-base-route";
import { pushDeleteAll } from "ember-twiddle/utils/push-deletion";

const { get, inject, run } = Ember;

export default GistRoute.extend({
  notify: inject.service(),
  state: inject.service(),

  model(params) {
    this.set('state.lastGistId', params.gistId);
    run(() => pushDeleteAll(this.get('store'), 'gist-file'));

    return this.get('store').find('gist', params.gistId);
  },

  setupController() {
    this._super(...arguments);

    const gistController = this.controllerFor('gist');
    Ember.run.schedule('afterRender', function() {
      gistController.set('unsaved', false);
    });
  },

  serialize(gist) {
    return { gistId: get(gist, 'id') || get(gist, 'gistId') };
  },

  actions: {
    error(error) {
      let notify = this.get('notify');

      if (error && error.errors && error.errors.length > 0) {
        let error1 = error.errors[0];

        if (error1.status === '404') {
          notify.info('The gist is missing or secret.');
          return this.transitionTo('gist.new');
        }
      }

      return true;
    }
  }
});
