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
