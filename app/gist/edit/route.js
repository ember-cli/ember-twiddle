import Ember from "ember";
import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  model (params) {
    this.store.unloadAll('gistFile');

    return this.store.find('gist', params.id);
  },

  setupController() {
    this._super.apply(this, arguments);

    let gistController = this.controllerFor('gist');
    Ember.run.schedule('afterRender', function() {
      gistController.set('unsaved', false);
    });
  },

  actions: {
    error(error) {
      if (error && error.errors && error.errors.length > 0) {
        let error1 = error.errors[0];
        if (error1.status === "404") {
          alert('The gist is missing or secret.');
          return this.transitionTo('gist.new');
        }
      }

      return true;
    }
  }
});
