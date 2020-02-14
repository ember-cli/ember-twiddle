import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | escaping moustaches', function(hooks) {
  setupApplicationTest(hooks);

  test('Able to escape moustache tag', function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "\\{{Moustache}} ${{stuff}}"
      }
    ];

    runGist(files);

    assert.equal(outputContents(), '{{Moustache}} $', 'Moustache tag is escaped');
  });
});
