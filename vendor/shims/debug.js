(function() {
  function vendorModule() {
    'use strict';

    const {
      assert,
      debug,
      deprecate,
      registerDeprecationHandler,
      registerWarnHandler,
      runInDebug,
      warn
    } = Ember;
    return {
      assert,
      debug,
      deprecate,
      registerDeprecationHandler,
      registerWarnHandler,
      runInDebug,
      warn
    };
  }

  define('@ember/debug', [], vendorModule);
})();
