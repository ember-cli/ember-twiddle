import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  model (params) {
    this.store.unloadAll('gistFile');

    return this.store.find('gist', params.id);
  },

  actions: {
    error(error) {
      if (error && error.status === 404) {
        alert('The gist is missing or secret.');
        return this.transitionTo('gist.new');
      }

      return true;
    }
  }
});
