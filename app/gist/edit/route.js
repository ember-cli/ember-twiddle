import Ember from "ember";
import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  model (params) {
    this.get('store').unloadAll('gistFile');

    return this.get('store').find('gist', params.gistId);
  },

  setupController(...args) {
    this._super(...args);

    const gistController = this.controllerFor('gist');
    Ember.run.schedule('afterRender', function() {
      gistController.set('unsaved', false);
    });
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
    }
  }
});
