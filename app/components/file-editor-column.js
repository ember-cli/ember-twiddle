export default Em.Component.extend({
  focusEditor: 'focusEditor',
  selectFile: 'selectFile',

  editorMode: Em.computed('file.extension', function () {
    switch(this.get('file.extension')) {
      case '.js':
        return 'javascript';
      case '.hbs':
        return 'handlebars';
      case '.css':
        return 'css';
      default:
        return 'html';
    }
  }),

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
