import GistRoute from "ember-twiddle/routes/gist-base-route";

export default GistRoute.extend({
  model (params) {
    this.store.unloadAll('gistFile');

    return this.store.find('gist', params.id);
  }
});