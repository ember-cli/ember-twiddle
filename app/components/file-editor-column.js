import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
const MAX_COLUMNS = 3;

export default Component.extend({
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

  isFirstColumn: equal('col', '1'),

  focusIn () {
    this.focusEditor(this);
  },

  actions: {
    selectAndSetFile(file) {
      this.set('file', file);
      this.selectFile(file);
    },

    valueUpdated(value, __, changeObj) {
      const isUserChange = changeObj.origin !== 'setValue';
      this.contentChanged(isUserChange, value);
    }
  }
});
