import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import config from '../config/environment';
import FlatToNested from 'flat-to-nested';

const flatToNested = new FlatToNested();

export default Component.extend({
  treeService: service('tree'),

  jsTreeActionReceiver: null,

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
          //pathObj.parent = '#';
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
    let flatTree = fileTreeObjects.map(treeObject => {
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

    return flatToNested.convert(flatTree);
  }),

  actions: {
    handleSelectTreeNode(node) {
      if (node.leaf) {
        this.openFile(node.path);
        return;
      }
      this.jsTreeActionReceiver.send('toggleNode', node.id);
    },

    didBecomeReady() {
      if(this.didBecomeReady) {
        this.didBecomeReady();
      }
    },

    didChange() {
      if (this.didChange) {
        this.didChange();
      }
    },

    hideFileTree() {
      this.hideFileTree();
    },

    expandAll() {
      this.jsTreeActionReceiver.send('openAll');
    },

    collapseAll() {
      this.jsTreeActionReceiver.send('closeAll');
    }
  }

});
