import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Ember from 'ember';
import DS from 'ember-data';


module('Unit | Model | gist file', function(hooks) {
  setupTest(hooks);

  test('it calls "registerDeletedFile" on gist relationship when deleting a record', function(assert) {
    assert.expect(1);

    const adapter = DS.Adapter.extend({
      createRecord() {
        return Ember.RSVP.resolve({ id: 1 });
      }
    });
    this.owner.register('adapter:application', adapter);
    const store = this.owner.lookup('service:store');

    run(() => {
      const gist = store.createRecord('gist');
      gist.registerDeletedFile = () => {
        assert.ok(true, '"registerDeletedFile" was called');
      };
      const model = run(() => this.owner.lookup('service:store').createRecord('gist-file', { gist }));

      model.save().then(() => {
        model.deleteRecord();
      });
    });
  });
});
