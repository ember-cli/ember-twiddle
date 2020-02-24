import Ember from 'ember';
import ResizeMixin from 'ember-twiddle/mixins/resize';
import $ from 'jquery';

const { inject } = Ember;

export default Ember.Component.extend(ResizeMixin, {
  app: inject.service(),

  iframeId: 'dummy-content-iframe',
  classNames: ['content'],

  didReceiveAttrs() {
    if(!this.element) {
      return;
    }

    if (this.isBuilding) {
      return;
    }

    if (this.element.firstElementChild) {
      this.element.removeChild(this.element.firstElementChild);
    }

    let oldIframe = document.getElementById(this.iframeId);
    if (oldIframe) {
      oldIframe.parentNode.removeChild(oldIframe);
    }

    let ifrm = document.createElement('iframe');
    ifrm.id = this.iframeId;
    let supportsSrcDoc = ('srcdoc' in ifrm);

    if (!Ember.testing && supportsSrcDoc) {
      ifrm.sandbox = 'allow-scripts allow-forms allow-modals';
      ifrm.srcdoc = this.html;
    }

    this.element.appendChild(ifrm);

    if(!supportsSrcDoc && !Ember.testing) {
      ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
      ifrm.document.open();
      ifrm.document.write('<p>Your browser doesn\'t support the <code>srcdoc</code> attribute for iframes. Ember Twiddle needs this to run safely.</p><p>Please use the latest version of Chrome, Safari or Firefox.</p><p>More information: <a href="https://github.com/ember-cli/ember-twiddle#browser-support">https://github.com/ember-cli/ember-twiddle#browser-support</a>');
      ifrm.document.close();
    }

    this.app.setCurrentIFrame(ifrm);

    if (Ember.testing) {
      ifrm = ifrm.contentWindow;
      ifrm.document.open();
      ifrm.document.write(this.html);
      ifrm.document.close();
    }
  },

  didInsertElement() {
    this._super();
    this.didResize();
  },

  didResize() {
    let offset = this.$().offset(), width = this.$().width(),
        height = this.$().height();

    $('#root').css({
      top:    offset.top,
      left:   offset.left,
      width:  width,
      height: height
    });
  },

  willDestroyElement() {
    this._super();

    let oldIframe = document.getElementById(this.iframeId);
    if (oldIframe) {
      oldIframe.parentNode.removeChild(oldIframe);
    }

    this.app.setCurrentIFrame(null);
  }
});
