(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['path'] };
  }

  define('path', [], vendorModule);
})();
