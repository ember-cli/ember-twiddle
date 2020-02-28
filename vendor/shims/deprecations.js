(function() {
  function vendorModule() {
    'use strict';

    const {
      deprecate
    } = Ember;
    return {
      deprecate
    };
  }

  define('@ember/application/deprecations', [], vendorModule);
})();
