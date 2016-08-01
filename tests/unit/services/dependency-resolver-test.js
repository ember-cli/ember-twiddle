import { moduleFor, test } from 'ember-qunit';

moduleFor('service:dependency-resolver', 'Unit | Service | dependency resolver');

test('resolveDependencies() leaves URLs untouched', function(assert) {
  var service = this.subject();

  var dependencies = {
    jquery: '//my-cdn.com/1.2.3/jquery.js',
    ember: 'https://my-cdn.com/1.2.3/ember.js',
    'ember-template-compiler': '//my-cdn.com/1.2.3/ember-template-compiler.js',
    'ember-testing': '//another-cdn.com/1.2.3/ember-testing.js',
    'ember-data': '//my-cdn.com/1.2.3/ember-data.js'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    jquery: '//my-cdn.com/1.2.3/jquery.js',
    ember: 'https://my-cdn.com/1.2.3/ember.js',
    'ember-template-compiler': '//my-cdn.com/1.2.3/ember-template-compiler.js',
    'ember-testing': '//another-cdn.com/1.2.3/ember-testing.js',
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

test('it resolves beta versions for ember', function(assert) {
  var service = this.subject();

  var dependencies = {
    ember: '2.4.0-beta.2'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    ember: '//cdnjs.cloudflare.com/ajax/libs/ember.js/2.4.0-beta.2/ember.debug.js'
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

test('it resolves version for ember-testing', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember-testing': '1.12.1'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember-testing': '//cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember-testing.js'
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
    'ember-testing': 'release',
    'ember-data': 'release',
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember': '//s3.amazonaws.com/builds.emberjs.com/release/ember.debug.js',
    'ember-template-compiler': '//s3.amazonaws.com/builds.emberjs.com/release/ember-template-compiler.js',
    'ember-testing': '//s3.amazonaws.com/builds.emberjs.com/release/ember-testing.js',
    'ember-data': '//s3.amazonaws.com/builds.emberjs.com/release/ember-data.js'
  });
});

test('beta channel can be specified for version', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember': 'beta',
    'ember-template-compiler': 'beta',
    'ember-testing': 'beta',
    'ember-data': 'beta',
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember': '//s3.amazonaws.com/builds.emberjs.com/beta/ember.debug.js',
    'ember-template-compiler': '//s3.amazonaws.com/builds.emberjs.com/beta/ember-template-compiler.js',
    'ember-testing': '//s3.amazonaws.com/builds.emberjs.com/beta/ember-testing.js',
    'ember-data': '//s3.amazonaws.com/builds.emberjs.com/beta/ember-data.js'
  });
});

test('canary channel can be specified for version', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember': 'canary',
    'ember-template-compiler': 'canary',
    'ember-testing': 'canary',
    'ember-data': 'canary',
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember': '//s3.amazonaws.com/builds.emberjs.com/canary/ember.debug.js',
    'ember-template-compiler': '//s3.amazonaws.com/builds.emberjs.com/canary/ember-template-compiler.js',
    'ember-testing': '//s3.amazonaws.com/builds.emberjs.com/canary/ember-testing.js',
    'ember-data': '//s3.amazonaws.com/builds.emberjs.com/canary/ember-data.js'
  });
});

test('alpha channel can be specified for version', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember': 'alpha',
    'ember-template-compiler': 'alpha',
    'ember-testing': 'alpha',
    'ember-data': 'alpha',
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember': '//s3.amazonaws.com/builds.emberjs.com/alpha/ember.debug.js',
    'ember-template-compiler': '//s3.amazonaws.com/builds.emberjs.com/alpha/ember-template-compiler.js',
    'ember-testing': '//s3.amazonaws.com/builds.emberjs.com/alpha/ember-testing.js',
    'ember-data': '//s3.amazonaws.com/builds.emberjs.com/alpha/ember-data.js'
  });
});
