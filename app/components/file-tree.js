import Ember from "ember";
import _ from 'lodash/lodash';

const { computed } = Ember;

export default Ember.Component.extend({
  jsTreeActionReceiver: null,

  /**
   * Calculate data for file tree
   */
  fileTreeData: computed('model.files.[]', function() {
    let seq = 0;
    let treeData = this.get('model.files').map(function(file) {
      let path = file.get('filePath');
      let splitPath = path.split("/");
      let parentPath = splitPath.slice(0, -1).join("/");
      let fileName = splitPath[splitPath.length - 1];
      if (parentPath === "") {
        parentPath = "#";
      }
      return {
        id: "node" + seq++,
        text: fileName,
        parent: parentPath,
        icon: "glyphicon glyphicon-file light-gray",
        path: path,
        leaf: true
      };
    });

    let done = false;
    do {
      done = true;
      let paths = _.uniq(_.pluck(treeData, 'text'));
      let parents = _.uniq(_.pluck(treeData, 'parent'));
      parents.forEach(function(parent) {
        if (!paths.contains(parent) && parent !== "#" && treeData.filterBy('path', parent).length === 0) {
          let splitPath = parent.split("/");
          let parentPath = splitPath.slice(0, -1).join("/");
          let fileName = splitPath[splitPath.length - 1];
          if (parentPath === "") {
            parentPath = "#";
          }
          treeData.push({
            id: "node" + seq++,
            text: fileName,
            parent: parentPath,
            icon: "glyphicon glyphicon-folder-open yellow",
            path: parent
          });
          done = false;
        }
      });
    } while (!done);

    let idMap = {};
    treeData.forEach(function(node) {
      idMap[node.path] = node.id;
    });

    treeData.forEach(function(node) {
      if (node.parent !== "#") {
        node.parent = idMap[node.parent];
      }
    });

    return treeData;
  }),

  actions: {
    handleSelectTreeNode(node) {
      if (node.original.leaf) {
        this.attrs.openFile(node.original.path);
        return;
      }
      this.get('jsTreeActionReceiver').send('toggleNode', node.id);
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
