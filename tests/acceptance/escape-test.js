import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

module('Acceptance | escaping moustaches', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Able to escape moustache tag', async function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "\\{{Moustache}} ${{stuff}}"
      }
    ];

    await runGist(files);

    assert.equal(outputContents(), '{{Moustache}} $', 'Moustache tag is escaped');
  });
});
