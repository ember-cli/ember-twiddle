(function() {
  function vendorModule() {
    'use strict';

    function compile(strings) {
      return Ember.HTMLBars.compile(strings[0]);
    }

    return { 'default': compile };
  }

  define('htmlbars-inline-precompile', [], vendorModule);
})();
