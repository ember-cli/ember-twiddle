import Ember from "ember";
import config from '../config/environment';

const { computed } = Ember;

export default Ember.Component.extend({
  jsTreeActionReceiver: null,

  fileTreeHash: computed('model.files.@each.filePath', function() {
    const files = this.get('model.files') || [];

    return files.reduce((accumulator, file) => {
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
    const fileTreeHash = this.get('fileTreeHash');
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
        this.attrs.openFile(node.original.path);
        return;
      }
      this.get('jsTreeActionReceiver').send('toggleNode', node.id);
    },

    didBecomeReady() {
      if(this.attrs.didBecomeReady) {
        this.attrs.didBecomeReady();
      }
    },

    didChange() {
      if (this.attrs.didChange) {
        this.attrs.didChange();
      }
    },

    hideFileTree() {
      this.attrs.hideFileTree();
    },

    expandAll() {
      this.get('jsTreeActionReceiver').send('openAll');
    },

    collapseAll() {
      this.get('jsTreeActionReceiver').send('closeAll');
    }
  }

});
