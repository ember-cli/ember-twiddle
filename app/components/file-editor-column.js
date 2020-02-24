import Ember from 'ember';

const { computed } = Ember;
const MAX_COLUMNS = 3;

export default Ember.Component.extend({
  keyMap: 'basic',
  file: null,

  editorMode: computed('file.extension', function () {
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

  isLastColumn: computed('col', 'numColumns', function() {
    let numColumns = this.numColumns;
    return (this.col | 0) === numColumns && numColumns < MAX_COLUMNS;
  }),

  isFirstColumn: computed.equal('col', '1'),

  showFileTreeOpenIcon: computed('isFirstColumn', 'fileTreeShown', function() {
    return this.isFirstColumn && !this.fileTreeShown;
  }),

  focusIn () {
    this.focusEditor(this);
  },

  actions: {
    selectFile(file) {
      this.set('file', file);
      this.selectFile(file);
    },

    valueUpdated(value, __, changeObj) {
      const isUserChange = changeObj.origin !== 'setValue';
      this.contentChanged(isUserChange, value);
    },

    removeColumn(col) {
      this.removeColumn(col);
    },

    addColumn() {
      this.addColumn();
    },

    showFileTree() {
      this.showFileTree();
    }
  }
});
