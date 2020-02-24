import Ember from "ember";

export default Ember.Route.extend({
  title(tokens) {
    return "Ember Twiddle - " + tokens.join(" - ");
  },

  actions: {
    titleUpdated() {
      this.get('_router').updateTitle();
    }
  }
});
