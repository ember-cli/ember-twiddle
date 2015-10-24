import Ember from "ember";

export default Ember.Route.extend({
  title: function(tokens) {
    return "Ember Twiddle - " + tokens.join(" - ");
  },

  actions: {
    titleUpdated() {
      this.get('router').updateTitle();
    }
  }
});
