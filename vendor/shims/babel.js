(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['babel'] };
  }

  define('babel-core', [], vendorModule);
})();
