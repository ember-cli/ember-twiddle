import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';
const { run } = Ember;

moduleForModel('gist-file', 'Unit | Model | gist file', {
  needs: ['model:gist', 'model:gist-revision', 'model:gist-version']
});

test('it calls "registerDeletedFile" on gist relationship when deleting a record', function(assert) {
  assert.expect(1);

  const adapter = DS.Adapter.extend({
    createRecord() {
      return Ember.RSVP.resolve();
    }
  });
  this.register('adapter:application', adapter);
  const store = this.store();

  run(() => {
    const gist = store.createRecord('gist');
    gist.registerDeletedFile = () => {
      assert.ok(true, '"registerDeletedFile" was called');
    };
    const model = this.subject({ gist });

    model.save().then(() => {
      model.deleteRecord();
    });
  });
});
