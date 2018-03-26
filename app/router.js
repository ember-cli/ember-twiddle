import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('gist', {path: '/'}, function() {
    this.route('new', {path: '/'});
    // eslint-disable-next-line
    this.route('edit', {path: '/:gistId'}, function() {
      this.route('copy');
      // eslint-disable-next-line
      this.route('revision', {path: '/:revId'});
    });
  });
  this.route('twiddles');
});

export default Router;
