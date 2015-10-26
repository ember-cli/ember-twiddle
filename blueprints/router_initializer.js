import Router from 'demo-app/router';
import Ember from 'ember';
import config from 'demo-app/config/environment';

Router.reopen({
  updateUrlBar: Ember.on('didTransition', function() {
    window.parent.postMessage({
      setDemoAppUrl: this.get('url')
    }, config.TWIDDLE_ORIGIN);
  }),

  listenForOutsideDemoAppUrlChanges: Ember.on('init', function() {
    var router = this;

    function demoAppUrlChanged(event) {
      if (event.origin !== config.TWIDDLE_ORIGIN) {
        return;
      }

      if (event.data.newUrl) {
        router.transitionTo(event.data.newUrl);
      }
    }

    window.addEventListener('message', demoAppUrlChanged, false);
  })
});

export default {
  name: 'router',
  initialize: function() {}
};