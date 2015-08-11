import Ember from 'ember';

export default Ember.Component.extend({
  focusEditor: 'focusEditor',
  selectFile: 'selectFile',
  keyMap: 'basic',

  editorMode: Ember.computed('file.extension', function () {
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
    this.sendAction('focusEditor', this);
  },

  actions: {
    selectFile (file) {
      this.set('file', file);
      this.sendAction('selectFile', file);
    },

    valueUpdated() {
      this.sendAction('contentsChanged');
    }
  }
});
