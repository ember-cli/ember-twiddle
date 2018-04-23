(function() {
  function vendorModule() {
    // Originally from https://github.com/joaonuno/flat-to-nested-js
    'use strict';

    /**
     * Create a new FlatToNested object.
     *
     * @constructor
     * @param {object} config The configuration object.
     */
    function FlatToNested(config) {
      this.config = config = config || {};
      this.config.id = config.id || 'id';
      this.config.parent = config.parent || 'parent';
      this.config.children = config.children || 'children';
    }

    /**
     * Convert a hierarchy from flat to nested representation.
     *
     * @param {array} flat The array with the hierachy flat representation.
     */
    FlatToNested.prototype.convert = function (flat) {
      var i, len, temp, roots, id, parent, nested, pendingChildOf, flatEl;
      i = 0;
      roots = [];
      temp = {};
      pendingChildOf = {};

      for (i, len = flat.length; i < len; i++) {
        flatEl = flat[i];
        id = flatEl[this.config.id];
        parent = flatEl[this.config.parent];
        temp[id] = flatEl;
        if (parent === undefined || parent === null) {
          // Current object has no parent, so it's a root element.
          roots.push(flatEl);
        } else {
          if (temp[parent] !== undefined) {
            // Parent is already in temp, adding the current object to its children array.
            initPush(this.config.children, temp[parent], flatEl);
          } else {
            // Parent for this object is not yet in temp, adding it to pendingChildOf.
            initPush(parent, pendingChildOf, flatEl);
          }
          delete flatEl[this.config.parent];
        }
        if (pendingChildOf[id] !== undefined) {
          // Current object has children pending for it. Adding these to the object.
          multiInitPush(this.config.children, flatEl, pendingChildOf[id]);
        }
      }

      if (roots.length === 1) {
        nested = roots[0];
      } else if (roots.length > 1) {
        nested = {};
        nested[this.config.children] = roots;
      } else {
        nested = {};
      }
      return nested;
    };

    function initPush(arrayName, obj, toPush) {
      if (obj[arrayName] === undefined) {
        obj[arrayName] = [];
      }
      obj[arrayName].push(toPush);
    }

    function multiInitPush(arrayName, obj, toPushArray) {
      var len;
      len = toPushArray.length;
      if (obj[arrayName] === undefined) {
        obj[arrayName] = [];
      }
      while (len-- > 0) {
        obj[arrayName].push(toPushArray.shift());
      }
    }

    return { 'default': FlatToNested };
  }

  define('flat-to-nested', [], vendorModule);
})();
