(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['Babel'] };
  }

  define('@babel/core', [], vendorModule);
})();
