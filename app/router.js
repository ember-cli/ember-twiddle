import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('gist', {path: '/'}, function() {
    this.route('new', {path: '/'});
    this.route('edit', {path: '/:gistId'}, function() {
      this.route('copy');
      this.route('revision', {path: '/:revId'});
    });
  });
  this.route('twiddles');
});

export default Router;
