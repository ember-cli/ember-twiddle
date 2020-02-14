import { get } from '@ember/object';
import { run, schedule } from '@ember/runloop';
import GistRoute from "ember-twiddle/routes/gist-base-route";
import { pushDeleteAll } from "ember-twiddle/utils/push-deletion";

export default GistRoute.extend({
  model(params) {
    run(() => pushDeleteAll(this.get('store'), 'gist-file'));

    return this.get('store').find('gist', params.gistId);
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
      if (error && error.errors && error.errors.length > 0) {
        let error1 = error.errors[0];
        if (error1.status === "404") {
          if (alert) {
            alert('The gist is missing or secret.');
          }
          return this.transitionTo('gist.new');
        }
      }

      return true;
    },

    showRevision(id) {
      this.transitionTo('gist.edit.revision', this.paramsFor('gist.edit', 'gistId'), id);
    }
  }
});
