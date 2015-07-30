import Ember from "ember";
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:gist', {
  needs: ['service:ember-cli'],

  beforeEach() {
    this._originalConfirm = window.confirm;
  },

  afterEach() {
    window.confirm = this._originalConfirm;
  }
});

test('deleting a gist requires confirmation', function(assert) {
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
});
