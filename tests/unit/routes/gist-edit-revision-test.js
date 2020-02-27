import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('route:gist.edit', function(hooks) {
  setupTest(hooks);

  test('Can load previous revision of a gist', function(assert) {
    let gistId = "a1b2c3d40";
    let revisionId = "b1c2d3e4";

    let route = this.owner.factoryFor('route:gist.edit').create({
      transitionTo(routeName, param1, param2) {
        this.set('transitionedToRoute', routeName);
        this.set('transitionedWithParam1', param1);
        this.set('transitionedWithParam2', param2);
      },
      paramsFor() { return gistId; },
      notify: {
        info() {}
      }
    });

    route.send('showRevision', revisionId);
    assert.equal(route.get('transitionedToRoute'), 'gist.edit.revision');
    assert.equal(route.get('transitionedWithParam1'), gistId);
    assert.equal(route.get('transitionedWithParam2'), revisionId);
  });
});
