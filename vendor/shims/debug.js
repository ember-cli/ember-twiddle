(function() {
  function vendorModule() {
    'use strict';

    const {
      assert,
      debug,
      deprecate,
      Debug,
      runInDebug,
      warn
    } = Ember;
    let registerDeprecationHandler, registerWarnHandler;
    if (Debug) {
      ({ registerDeprecationHandler, registerWarnHandler } = Debug);
    }
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
