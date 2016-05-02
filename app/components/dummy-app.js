import Ember from 'ember';
import ResizeMixin from 'ember-twiddle/mixins/resize';

const { $, on, inject } = Ember;

export default Ember.Component.extend(ResizeMixin, {
  app: inject.service(),

  iframeId: 'dummy-content-iframe',
  classNames: ['content'],

  didReceiveAttrs: function() {
    if(!this.element) {
      return;
    }

    if(this.element.firstElementChild) {
      this.element.removeChild(this.element.firstElementChild);
    }

    if (this.get('isBuilding')) {
      return;
    }

    let ifrm = document.createElement('iframe');
    ifrm.id = this.iframeId;
    let supportsSrcDoc = ('srcdoc' in ifrm);

    if (!Ember.testing && supportsSrcDoc) {
      ifrm.sandbox = 'allow-scripts allow-forms allow-modals';
      ifrm.srcdoc = this.get('html');
    }

    this.element.appendChild(ifrm);

    if(!supportsSrcDoc && !Ember.testing) {
      ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
      ifrm.document.open();
      ifrm.document.write('<p>Your browser doesn\'t support the <code>srcdoc</code> attribute for iframes. Ember Twiddle needs this to run safely.</p><p>Please use the latest version of Chrome, Safari or Firefox.</p><p>More information: <a href="https://github.com/ember-cli/ember-twiddle#browser-support">https://github.com/ember-cli/ember-twiddle#browser-support</a>');
      ifrm.document.close();
    }

    this.get('app').setCurrentIFrame(ifrm);

    if (Ember.testing) {
      ifrm = ifrm.contentWindow;
      ifrm.document.open();
      ifrm.document.write(this.get('html'));
      ifrm.document.close();
    }
  },

  didResize: on('didInsertElement', function () {
    let offset = this.$().offset(), width = this.$().width(),
        height = this.$().height();

    $('#root').css({
      top:    offset.top,
      left:   offset.left,
      width:  width,
      height: height
    });
  })
});
