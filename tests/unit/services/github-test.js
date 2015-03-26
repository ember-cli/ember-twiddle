import {
  moduleFor,
  test
} from 'ember-qunit';

import gistFixtures from '../../fixtures/gist';
import Gist from '../../../lib/gist';

moduleFor('service:github', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});

// Replace this with your real tests.
test('deserialize works', function(assert) {
  var service = this.subject();

  var gist = service.deserializeGist(gistFixtures['f2c90713bdfdf54a262b']);
  assert.ok(gist instanceof Gist, 'deserializeGist should return a Gist instance');
});
