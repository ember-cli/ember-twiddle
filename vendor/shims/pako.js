(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['pako'],
      __esModule: true,
    };
  }

  define('pako', [], vendorModule);
})();
