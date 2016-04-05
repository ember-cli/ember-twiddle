import Ember from 'ember';

export default Ember.Service.extend({
  setCurrentIFrame: function(iframe) {
    this.iframe = iframe;
  },

  postMessage: function(data) {
    if (this.iframe) {
      this.iframe.contentWindow.postMessage(data, '*');
    }
  }
});
