import Ember from "ember";
import GistRoute from "ember-twiddle/routes/gist-base-route";
import { pushDeleteAll } from "ember-twiddle/utils/push-deletion";

const { get, run } = Ember;

export default GistRoute.extend({
  model(params) {
    run(() => pushDeleteAll(this.store, 'gist-file'));

    return this.store.find('gist', params.gistId);
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
