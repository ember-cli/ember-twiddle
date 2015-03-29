export default Em.Route.extend({
  setupController (controller, context) {
    this.controllerFor('gist').set('model', context);
  }
});