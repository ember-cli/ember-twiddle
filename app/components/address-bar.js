import Ember from "ember";

export default Ember.Component.extend({
  classNames: ["url-bar"],

  change(event) {
    this.sendAction("urlChanged", event.target.value);
  }
});
