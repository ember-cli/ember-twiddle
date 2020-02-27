import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend ({
  col: "",
  controller: null,
  active: computed('controller.activeEditorCol', 'col', function() {
    return this.get('controller.activeEditorCol') === this.col;
  }),
  show: computed('controller.realNumColumns', 'col', function() {
    return this.get('controller.realNumColumns') >= this.col;
  }),
  file: null
});
