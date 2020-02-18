import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

module('Acceptance | older version', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Able to run a gist using an older version of Ember', async function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Hello, World!"
      },
      {
        filename: 'twiddle.json',
        content:
          '{\n' +
          '  "version": "0.4.0",\n' +
          '  "dependencies": {\n' +
          '    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",\n' +
          '    "ember": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember.debug.js",\n' +
          '    "ember-template-compiler": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember-template-compiler.js",\n' +
          '    "ember-data": "https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.0.0-beta.19.2/ember-data.js"\n' +
          '  }\n' +
          '}'
      }
    ];

    await runGist(files);

    assert.equal(outputContents(), 'Hello, World!', 'Gist running Ember 1.12.1 is displayed');
  });
});
