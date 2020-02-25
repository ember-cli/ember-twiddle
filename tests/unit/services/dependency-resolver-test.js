import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | dependency resolver', function(hooks) {
  setupTest(hooks);

  test('resolveDependencies() leaves URLs untouched', function(assert) {
    var service = this.owner.lookup('service:dependency-resolver');

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
    var service = this.owner.lookup('service:dependency-resolver');

    var dependencies = {
      ember: '1.12.1'
    };

    service.resolveDependencies(dependencies);

    assert.deepEqual(dependencies, {
      ember: '//cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember.debug.js'
    });
  });

  test('it resolves beta versions for ember', function(assert) {
    var service = this.owner.lookup('service:dependency-resolver');

    var dependencies = {
      ember: '2.4.0-beta.2'
    };

    service.resolveDependencies(dependencies);

    assert.deepEqual(dependencies, {
      ember: '//cdnjs.cloudflare.com/ajax/libs/ember.js/2.4.0-beta.2/ember.debug.js'
    });
  });

  test('it resolves version for ember-template-compiler', function(assert) {
    var service = this.owner.lookup('service:dependency-resolver');

    var dependencies = {
      'ember-template-compiler': '1.12.1'
    };

    service.resolveDependencies(dependencies);

    assert.deepEqual(dependencies, {
      'ember-template-compiler': '//cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember-template-compiler.js'
    });
  });

  test('it resolves version for ember-testing', function(assert) {
    var service = this.owner.lookup('service:dependency-resolver');

    var dependencies = {
      'ember-testing': '1.12.1'
    };

    service.resolveDependencies(dependencies);

    assert.deepEqual(dependencies, {
      'ember-testing': '//cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember-testing.js'
    });
  });

  test('it resolves version for ember-data', function(assert) {
    var service = this.owner.lookup('service:dependency-resolver');

    var dependencies = {
      'ember-data': '1.12.1'
    };

    service.resolveDependencies(dependencies);

    assert.deepEqual(dependencies, {
      'ember-data': '//cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.12.1/ember-data.js'
    });
  });
});
