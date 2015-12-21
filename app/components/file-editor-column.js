import Ember from 'ember';

const { computed } = Ember;
const MAX_COLUMNS = 3;

export default Ember.Component.extend({
  focusEditor: 'focusEditor',
  selectFile: 'selectFile',
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
    let numColumns = this.get('numColumns');
    return (this.get('col') | 0) === numColumns && numColumns < MAX_COLUMNS;
  }),

  isFirstColumn: computed.equal('col', '1'),

  showFileTreeOpenIcon: computed('isFirstColumn', 'fileTreeShown', function() {
    return this.get('isFirstColumn') && !this.get('fileTreeShown');
  }),

  focusIn () {
    this.sendAction('focusEditor', this);
  },

  actions: {
    selectFile(file) {
      this.set('file', file);
      this.sendAction('selectFile', file);
    },

    valueUpdated(_, __, changeObj) {
      const isUserChange = changeObj.origin !== 'setValue';
      this.sendAction('contentChanged', isUserChange);
    },

    removeColumn(col) {
      this.attrs.removeColumn(col);
    },

    addColumn() {
      this.attrs.addColumn();
    },

    showFileTree() {
      this.attrs.showFileTree();
    }
  }
});
