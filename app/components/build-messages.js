import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  classNames: ['build-msgs'],

  actions: {
    showErrors() {
      this.buildErrors.forEach((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
      this.notify.error('Errors were dumped to console');
    }
  }
});
