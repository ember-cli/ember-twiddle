export default Em.Mixin.create({
  setupResizeHandler: function () {
    Em.$(window).on('resize', this.get("resizeHandler"));
  }.on('didInsertElement'),

  teardownResizeHandler: function () {
    Em.$(window).off('resize', this.get("resizeHandler"));
  }.on('willDestroyElement'),

  resizeHandler: function () {
    return Em.run.bind(this, 'didResize');
  }.property()
});