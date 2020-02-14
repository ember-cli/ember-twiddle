import Route from '@ember/routing/route';

export default Route.extend({
  title(tokens) {
    return "Ember Twiddle - " + tokens.join(" - ");
  },

  actions: {
    titleUpdated() {
      this.get('router').updateTitle();
    }
  }
});
