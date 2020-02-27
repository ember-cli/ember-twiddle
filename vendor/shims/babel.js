(function() {
  function vendorModule() {
    'use strict';

    self.process = { env: {} };
    return { 'default': self['Babel'] };
  }

  define('@babel/core', [], vendorModule);
})();
