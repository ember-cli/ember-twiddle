import Ember from 'ember';

export default Ember.Service.extend({
  setCurrentIFrame(iframe) {
    this.iframe = iframe;
  },

  postMessage(data) {
    if (this.iframe) {
      this.iframe.contentWindow.postMessage(data, '*');
    }
  }
});
