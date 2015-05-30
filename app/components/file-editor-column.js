export default Em.Component.extend({
  focusEditor: 'focusEditor',

  focusIn () {
    this.sendAction('focusEditor', this);
  },

  actions: {
    selectFile (file) {
      this.set('file', file);
    }
  }
});