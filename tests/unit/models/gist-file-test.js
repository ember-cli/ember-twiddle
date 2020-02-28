import { resolve } from 'rsvp';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import DS from 'ember-data';

module('Unit | Model | gist file', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it calls "registerDeletedFile" on gist relationship when deleting a record', async function(assert) {
    assert.expect(1);

    const adapter = DS.Adapter.extend({
      createRecord() {
        return resolve({ id: 1 });
      }
    });
    this.owner.register('adapter:application', adapter);
    const store = this.owner.lookup('service:store');

    await run(async () => {
      const gist = store.createRecord('gist');
      gist.registerDeletedFile = () => {
        assert.ok(true, '"registerDeletedFile" was called');
      };
      const model = run(() =>
        this.owner.lookup('service:store').createRecord('gist-file', {
          gist,
          filePath: 'path/to/file.js'
        })
      );

      await run(() => model.save());
      await run(() => model.deleteRecord());
    });
  });

  test('correctly determines filePath from fileName', function(assert) {
    const store = this.owner.lookup('service:store');
    let file1 = store.createRecord('gist-file', {
      fileName: 'twiddle\\.json'
    });
    assert.equal(file1.filePath, 'twiddle.json');
    let file2 = store.createRecord('gist-file', {
      fileName: 'controllers.application\\.js'
    });
    assert.equal(file2.filePath, 'controllers/application.js');
    let file3 = store.createRecord('gist-file', {
      fileName: 'controllers.app\\.ication\\.js'
    });
    assert.equal(file3.filePath, 'controllers/app.ication.js');
  });
});
