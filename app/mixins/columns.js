import Ember from "ember";
import Column from '../utils/column';

const { computed } = Ember;

const MAX_COLUMNS = 3;

export default Ember.Mixin.create({
  columns: null,

  realNumColumns: computed('numColumns', function() {
    return Math.min(this.get('numColumns'), MAX_COLUMNS);
  }),

  getColumnFile(column) {
    return this.get('columns').objectAt(column - 1).get('file');
  },

  setColumnFile(column, file) {
    this.get('columns').objectAt(column - 1).set('file', file);
  },

  /**
   * Creates the column objects
   */
  createColumns() {
    let columns = [];
    for (let i = 0; i < MAX_COLUMNS; ++i) {
      let col = (i + 1) + "";
      columns.pushObject(Column.create({
        col: col,
        controller: this
      }));
    }
    this.set('columns', columns);
  },

  /**
   * Clears the columns
   */
  clearColumns() {
    let numColumns = this.get('realNumColumns');
    for (let i = 1; i <= numColumns; ++i) {
      this.setColumnFile(i, undefined);
    }
  },

  /**
   * Set the initial files in the columns
   */
  initializeColumns() {
    const files = this.get('model.files');

    if (!files) {
      return;
    }

    const openFileNames = this.get('openFiles').split(",");
    const openFiles = openFileNames.map((file) => files.findBy('fileName', file));

    for (let i = 1; i <= openFiles.length; ++i) {
      this.setColumnFile(i, openFiles[i - 1]);
    }

    const numColumns = this.get('realNumColumns');

    let j = 0;
    const len = files.get('length');
    for (let i = 1; i <= numColumns; ++i) {
      if (!this.getColumnFile(i)) {
        j = 0;
        while (!this.isOpen(files.objectAt(j))) {
          j++;
          if (j >= len) {
            return;
          }
        }
        let file = files.objectAt(j);
        if (file) {
          this.setColumnFile(i, file);
        }
      }
    }
  },

  /**
   * Returns true if the passed in file is currently open
   * @param {Object} one of the files in the gist
   * @return {boolean}
   */
  isOpen(file) {
    if (!file) {
      return false;
    }

    for (let i = 1; i <= MAX_COLUMNS; ++i) {
      let colFile = this.getColumnFile(i);
      if (colFile && colFile.get('fileName') === file.get('fileName')){
        return false;
      }
    }

    return true;
  },

  removeColumn(col) {
    let numColumns = this.get('realNumColumns');

    for (var i = (col|0); i < numColumns; ++i) {
      this.setColumnFile(i, this.getColumnFile(i + 1));
    }
    this.setColumnFile(numColumns, undefined);

    let activeCol = this.get('activeEditorCol');
    if (activeCol >= col) {
      this.set('activeEditorCol', ((activeCol|0) - 1).toString());
    }
  },

  removeFileFromColumns (file) {
    for (let i = 1; i <= MAX_COLUMNS; ++i) {
      if (this.getColumnFile(i) === file) {
        this.setColumnFile(i, null);
      }
    }
  }
});
