import Ember from "ember";

const { computed } = Ember;

export default Ember.Object.extend ({
  col: "",
  controller: null,
  active: computed('controller.activeEditorCol', 'col', function() {
    return this.get('controller.activeEditorCol') === this.get('col');
  }),
  show: computed('controller.realNumColumns', 'col', function() {
    return this.get('controller.realNumColumns') >= this.get('col');
  }),
  file: null
});
