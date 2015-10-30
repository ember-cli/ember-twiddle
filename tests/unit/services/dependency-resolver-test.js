import { moduleFor, test } from 'ember-qunit';

moduleFor('service:dependency-resolver', 'Unit | Service | dependency resolver');

test('resolveDependencies() leaves URLs untouched', function(assert) {
  var service = this.subject();

  var dependencies = {
    jquery: '//my-cdn.com/1.2.3/jquery.js',
    ember: 'https://my-cdn.com/1.2.3/ember.js',
    'ember-template-compiler': '//my-cdn.com/1.2.3/ember-template-compiler.js',
    'ember-data': '//my-cdn.com/1.2.3/ember-data.js'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    jquery: '//my-cdn.com/1.2.3/jquery.js',
    ember: 'https://my-cdn.com/1.2.3/ember.js',
    'ember-template-compiler': '//my-cdn.com/1.2.3/ember-template-compiler.js',
    'ember-data': '//my-cdn.com/1.2.3/ember-data.js'
  });
});

test('it resolves version for ember', function(assert) {
  var service = this.subject();

  var dependencies = {
    ember: '1.12.1'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    ember: '//cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember.debug.js'
  });
});

test('it resolves version for ember-template-compiler', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember-template-compiler': '1.12.1'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember-template-compiler': '//cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember-template-compiler.js'
  });
});

test('it resolves version for ember-data', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember-data': '1.12.1'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember-data': '//cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.12.1/ember-data.js'
  });
});

test('release channel can be specified for version', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember': 'release',
    'ember-template-compiler': 'release',
    'ember-data': 'release',
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember': '//ember.alexspeller.com/release/ember.debug.js',
    'ember-template-compiler': '//ember.alexspeller.com/release/ember-template-compiler.js',
    'ember-data': '//ember.alexspeller.com/release/ember-data.js'
  });
});

test('beta channel can be specified for version', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember': 'beta',
    'ember-template-compiler': 'beta',
    'ember-data': 'beta',
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember': '//ember.alexspeller.com/beta/ember.debug.js',
    'ember-template-compiler': '//ember.alexspeller.com/beta/ember-template-compiler.js',
    'ember-data': '//ember.alexspeller.com/beta/ember-data.js'
  });
});

test('canary channel can be specified for version', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember': 'canary',
    'ember-template-compiler': 'canary',
    'ember-data': 'canary',
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember': '//ember.alexspeller.com/canary/ember.debug.js',
    'ember-template-compiler': '//ember.alexspeller.com/canary/ember-template-compiler.js',
    'ember-data': '//ember.alexspeller.com/canary/ember-data.js'
  });
});
