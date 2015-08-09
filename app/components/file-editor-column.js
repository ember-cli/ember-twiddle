import Ember from 'ember';

const { computed } = Ember;
const MAX_COLUMNS = 3;

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

  lastColumn: computed('col', 'numColumns', function() {
    let numColumns = this.get('numColumns');
    return (this.get('col') | 0) === numColumns && numColumns < MAX_COLUMNS;
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
    },

    removeColumn(col) {
      this.attrs.removeColumn(col);
    },

    addColumn() {
      this.attrs.addColumn();
    }
  }
});
