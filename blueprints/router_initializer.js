import Router from '../router';
import { on } from '@ember/object/evented';
import config from '../config/environment';

Router.reopen({
  updateUrlBar: on('didTransition', function() {
    window.parent.postMessage({
      setAppUrl: this.get('url')
    }, config.TWIDDLE_ORIGIN);
  }),

  listenForOutsideAppUrlChanges: on('init', function() {
    var router = this;

    function appUrlChanged(event) {
      if (event.origin !== config.TWIDDLE_ORIGIN) {
        return;
      }

      if (event.data.newUrl) {
        router.transitionTo(event.data.newUrl);
      }
    }

    window.addEventListener('message', appUrlChanged, false);
  })
});

export default {
  name: 'router',
  initialize: function() {}
};
