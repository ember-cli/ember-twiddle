import Ember from "ember";

export default Ember.Component.extend({
  focusEditor: 'focusEditor',
  selectFile: 'selectFile',

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

  contentsDidChange: function() {
    Ember.run.debounce(function() {
      this.sendAction('contentsChanged');
    }.bind(this), 500);
  }.observes('file.content'),

  actions: {
    selectFile (file) {
      this.set('file', file);
      this.sendAction('selectFile', file);
    }
  }
});
