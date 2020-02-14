import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | minimal', function(hooks) {
  setupApplicationTest(hooks);

  test('Able to do load a minimal gist', function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Hello, World!"
      }
    ];

    runGist(files);

    assert.equal(outputContents(), 'Hello, World!', 'Minimal gist is displayed');
  });
});
