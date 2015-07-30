import Router from 'demo-app/router';
import Ember from 'ember';
import config from 'demo-app/config/environment';

Router.reopen({
  updateUrlBar: Ember.on('didTransition', function() {
    window.parent.postMessage({setDemoAppUrl:this.get('url')}, config.TWIDDLE_ORIGIN);
  })
});

export default {
  name: 'router',
  initialize: function() {}
};