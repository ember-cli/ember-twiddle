import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

module('Acceptance | minimal', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Able to do load a minimal gist', async function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Hello, World!"
      }
    ];

    await runGist(files);

    assert.equal(outputContents(), 'Hello, World!', 'Minimal gist is displayed');
  });
});
