import ResizeMixin from 'ember-twiddle/lib/resize-mixin';

export default Em.Component.extend(ResizeMixin, {
  didResize: function () {
    let offset = this.$().offset(), width = this.$().width(),
      height = this.$().height();
    Em.$('#demo-app').css({
      top:    offset.top,
      left:   offset.left,
      width:  width,
      height: height
    });
  }.on('didInsertElement')
});
