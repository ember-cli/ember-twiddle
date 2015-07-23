export default Em.Component.extend({
  focusEditor: 'focusEditor',
  selectFile: 'selectFile',

  focusIn () {
    this.sendAction('focusEditor', this.get('col'));
  },

  actions: {
    selectFile (file) {
      this.set('file', file);
      this.sendAction('selectFile', file);
    }
  }
});
