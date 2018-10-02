(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['untar'],
      __esModule: true,
    };
  }

  define('untar', [], vendorModule);
})();
