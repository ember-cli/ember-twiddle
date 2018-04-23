import Ember from "ember";

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['gist-body'],
  noColumns: computed.equal('numColumns', 0)
});
