import Component from '@ember/component';
import { computed } from '@ember/object';
import config from '../config/environment';

export default Component.extend({
  jsTreeActionReceiver: null,

  init() {
    this._super(...arguments);
    this.contextmenuOptions = {
      items: {
        rename: {
          action: this.renameFile,
          label: 'Rename',
          icon: 'glyphicon glyphicon-edit'
        },
        move: {
          action: this.renameFile,
          label: 'Move',
          icon: 'glyphicon glyphicon-move'
        },
        delete: {
          action: this.removeFile,
          label: 'Delete',
          icon: 'glyphicon glyphicon-trash'
        }
      }
    };
  },

  fileTreeHash: computed('model.files.@each.filePath', function() {
    const files = this.get('model.files') || [];

    return files.reduce((accumulator, file) => {
      if (!file) {
        return accumulator;
      }

      const path = file.get('filePath');
      const splitPath = path.split('/');
      const splitPathZeroBasedLength = splitPath.length - 1;

      const possiblePaths = splitPath.map((pathPart, index, paths) => {
        const previousPathIsRoot = index - 1 < 0;
        const pathObj = {
          nodeName: pathPart,
          isFile: false
        };

        if(previousPathIsRoot) {
          pathObj.path = pathPart;
          pathObj.parent = '#';
        } else {
          const previousPath = paths.slice(0, index).join('/');
          pathObj.path = `${previousPath}/${pathPart}`;
          pathObj.parent = previousPath;
        }

        if(index === splitPathZeroBasedLength) {
          pathObj.isFile = true;
        }

        return pathObj;
      });

      const existingFilteredOut = possiblePaths.filter(pathObj => {
        return !accumulator[pathObj.path];
      });

      existingFilteredOut.forEach(pathObj => {
        accumulator[pathObj.path] = pathObj;
      });

      return accumulator;
    }, {});
  }),

  /**
   * Calculate data for file tree
   */
  fileTreeData: computed('fileTreeHash', function() {
    const fileTreeHash = this.fileTreeHash;
    const fileTreeKeys = Object.keys(fileTreeHash);
    const fileTreeObjects = fileTreeKeys.map(key => fileTreeHash[key]);

    let fileObjects = fileTreeObjects.filter(fileTreeObject => {
      return fileTreeObject.isFile;
    });
    let shouldStartOpened = fileObjects.length <= config.maxNumFilesInitiallyExpanded;

    return fileTreeObjects.map(treeObject => {
      const treeDataObject = {
        id: treeObject.path,
        text: treeObject.nodeName,
        parent: treeObject.parent,
        path: treeObject.path
      };

      if(treeObject.isFile) {
        treeDataObject.leaf = true;
        treeDataObject.icon = 'glyphicon glyphicon-file light-gray';
      } else {
        treeDataObject.icon = 'glyphicon glyphicon-folder-open yellow';
      }

      if(shouldStartOpened) {
        treeDataObject.state = {
          opened: true
        };
      }

      return treeDataObject;
    });
  }),

  actions: {
    handleSelectTreeNode(node) {
      if (node.original.leaf) {
        this.openFile(node.original.path);
        return;
      }
      this.jsTreeActionReceiver.send('toggleNode', node.id);
    },

    didBecomeReadyOptional() {
      if(this.didBecomeReady) {
        this.didBecomeReady();
      }
    },

    didChangeOptional() {
      if (this.didChange) {
        this.didChange();
      }
    },

    expandAll() {
      this.jsTreeActionReceiver.send('openAll');
    },

    collapseAll() {
      this.jsTreeActionReceiver.send('closeAll');
    }
  }

});
