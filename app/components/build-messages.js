import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['build-msgs'],

  actions: {
    showErrors() {
      this.get('buildErrors').forEach((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
      this.get('notify').error('Errors were dumped to console');
    }
  }
});
