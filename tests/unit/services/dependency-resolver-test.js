import { moduleFor, test } from 'ember-qunit';

moduleFor('service:dependency-resolver', 'Unit | Service | dependency resolver');

test('resolveDependencies() leaves URLs untouched', function(assert) {
  var service = this.subject();

  var dependencies = {
    jquery: 'http://my-cdn.com/1.2.3/jquery.js',
    ember: 'https://my-cdn.com/1.2.3/ember.js',
    'ember-template-compiler': 'http://my-cdn.com/1.2.3/ember-template-compiler.js',
    'ember-data': 'http://my-cdn.com/1.2.3/ember-data.js'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    jquery: 'http://my-cdn.com/1.2.3/jquery.js',
    ember: 'https://my-cdn.com/1.2.3/ember.js',
    'ember-template-compiler': 'http://my-cdn.com/1.2.3/ember-template-compiler.js',
    'ember-data': 'http://my-cdn.com/1.2.3/ember-data.js'
  });
});

test('it resolves version for ember', function(assert) {
  var service = this.subject();

  var dependencies = {
    ember: '1.12.1'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    ember: 'http://cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember.debug.js'
  });
});

test('it resolves version for ember-template-compiler', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember-template-compiler': '1.12.1'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember-template-compiler': 'http://cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember-template-compiler.js'
  });
});

test('it resolves version for ember-data', function(assert) {
  var service = this.subject();

  var dependencies = {
    'ember-data': '1.12.1'
  };

  service.resolveDependencies(dependencies);

  assert.deepEqual(dependencies, {
    'ember-data': 'http://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.12.1/ember-data.js'
  });
});
