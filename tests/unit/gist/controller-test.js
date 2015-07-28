import Ember from "ember";
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:gist', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['service:ember-cli']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});

test('deleting a gist requires confirmation', function(assert) {
  let cacheConfirm = window.confirm;
  let controller = this.subject({
    transitionToRoute() {},
    notify: {
      info() {}
    }
  });
  let gistClass = Ember.Object.extend({
    called: false,
    destroyRecord() {
      this.set('called', true);
    }
  });

  window.confirm = () => true;
  let gist = gistClass.create();
  controller.send('deleteGist', gist);
  assert.ok(gist.get('called'), 'gist.destroyRecord was called when confirmed');

  window.confirm = () => false;
  gist = gistClass.create();
  controller.send('deleteGist', gist);
  assert.ok(!gist.get('called'), 'gist.destroyRecord was not called when not confirmed');

  window.confirm = cacheConfirm;
});
