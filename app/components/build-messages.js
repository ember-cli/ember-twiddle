import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['build-msgs'],
  actions: {
    showErrors () {
      this.get('buildErrors').forEach((error) => {
        console.error(error);
      });
      this.get('notify').info('Errors were dumped to console');
    }
  }
});
