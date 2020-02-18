import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

module('Acceptance | no template compiler', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Able to load a gist without a template compiler', async function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Hello, World!"
      },
      {
        filename: 'twiddle.json',
        content: "{\n  \"version\": \"0.4.0\",\n  \"dependencies\": {\n    \"jquery\": \"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js\",\n    \"ember\": \"https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.10/ember.debug.js\"\n  }\n}"
      }
    ];

    await runGist(files);

    assert.equal(outputContents(), 'Hello, World!', 'Gist with no template compiler is displayed');
  });
});
