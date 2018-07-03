(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['compareVersions'],
      __esModule: true,
    };
  }

  define('compare-versions', [], vendorModule);
})();
