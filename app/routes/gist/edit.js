import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { run, schedule } from '@ember/runloop';
import GistRoute from "ember-twiddle/routes/gist-base-route";
import { pushDeleteAll } from "ember-twiddle/utils/push-deletion";

export default GistRoute.extend({
  notify: service(),
  state: service(),

  model(params) {
    this.set('state.lastGistId', params.gistId);
    run(() => pushDeleteAll(this.store, 'gist-file'));

    return this.store.findRecord('gist', params.gistId);
  },

  setupController() {
    this._super(...arguments);

    const gistController = this.controllerFor('gist');
    schedule('afterRender', function() {
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
