import Router from 'demo-app/router';
import Ember from 'ember';

Router.reopen({
  updateUrlBar: Ember.on('didTransition', function() {
    window.parent.demoAppUrl = this.get('url');
    window.parent.updateDemoAppUrl();
  })
});

export default {
  name: 'router',
  initialize: function() {}
};