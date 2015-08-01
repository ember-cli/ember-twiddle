import Ember from 'ember';

export default Ember.Route.extend({
  setupController (controller, context) {
    this.controllerFor('gist').set('model', context);
  }
});
