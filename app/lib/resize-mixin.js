import Ember from 'ember';

const {
  $,
  computed,
  on,
  run
} = Ember;

export default Ember.Mixin.create({
  setupResizeHandler: on('didInsertElement', function() {
    $(window).on('resize', this.get("resizeHandler"));
  }),

  teardownResizeHandler: on('willDestroyElement', function() {
    $(window).off('resize', this.get("resizeHandler"));
  }),

  resizeHandler: computed(function() {
    return run.bind(this, 'didResize');
  })
});
