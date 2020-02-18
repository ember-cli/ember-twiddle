import Ember from "ember";
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const { RSVP } = Ember;

module('route:gist', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this._originalConfirm = window.confirm;
    this._originalAlert = window.alert;
  });

  hooks.afterEach(function() {
    window.confirm = this._originalConfirm;
    window.alert = this._originalAlert;
  });

  test('deleting a gist requires confirmation', function(assert) {
    let controller = this.owner.factoryFor('route:gist').create({
      transitionTo() { return RSVP.resolve(); },
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
});
