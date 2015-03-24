import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('gist', {path: '/'}, function() {
    this.route('edit', {path: '/:id'});
  });
});

export default Router;
