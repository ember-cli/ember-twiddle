import Service from '@ember/service';

export default Service.extend({
  setCurrentIFrame(iframe) {
    this.iframe = iframe;
  },

  postMessage(data) {
    if (this.iframe) {
      this.iframe.contentWindow.postMessage(data, '*');
    }
  }
});
