import ResizeMixin from 'ember-twiddle/lib/resize-mixin';

export default Em.Component.extend(ResizeMixin, {
  iframeId: 'dummy-content-iframe',

  didReceiveAttrs: function() {
    if(!this.element) {
      return;
    }

    if(this.element.firstElementChild) {
      this.element.removeChild(this.element.firstElementChild);
    }

    var ifrm = document.createElement('iframe');
    ifrm.id=this.iframeId;
    this.element.appendChild(ifrm);

    ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
    ifrm.document.open();
    ifrm.document.write(this.get('html'));
    ifrm.document.close();
  },

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
