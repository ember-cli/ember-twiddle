import Ember from "ember";

const { computed } = Ember;

export default Ember.Component.extend({
  noColumns: computed.equal('numColumns', 0)
});
