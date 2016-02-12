/* globals define */
define('ember/load-initializers', ['exports', 'ember-load-initializers', 'ember'], function(exports, loadInitializers, Ember) {
  Ember['default'].deprecate(
    'Usage of `' + 'ember/load-initializers' + '` module is deprecated, please update to `ember-load-initializers`.',
    false,
    { id: 'ember-load-initializers.legacy-shims', until: '3.0.0' }
  );

  exports['default'] = loadInitializers['default'];
});
