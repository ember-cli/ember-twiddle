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

    var depsTags = '';

    var deps = this.get('twiddleJson').dependencies;
    Object.keys(deps).forEach(function(depKey) {
      var dep = deps[depKey];
      if (dep.substr(dep.lastIndexOf(".")) === '.css') {
        depsTags += '<link rel="stylesheet" type="text/css" href="%@">'.fmt(dep);
      } else {
        depsTags += '<script type="text/javascript" src="%@"></script>'.fmt(dep);
      }
    });

    depsTags += '<script type="text/javascript" src="assets/twiddle-vendor.js"></script>';

    var appjs = '<script type="text/javascript">%@</script>'.fmt(this.get('code'));
    var appCss = '<style type="text/css">%@</style>'.fmt(this.get('styles'));

    ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
    ifrm.document.open();
    ifrm.document.write(depsTags);
    ifrm.document.write(appCss);
    ifrm.document.write(appjs);
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
