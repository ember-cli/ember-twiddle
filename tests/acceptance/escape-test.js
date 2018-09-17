import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | escaping moustaches');

test('Able to escape moustache tag', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: "\\{{Moustache}} ${{stuff}}"
    }
  ];

  runGist(files);

  andThen(function() {
    assert.equal(outputContents(), '{{Moustache}} $', 'Moustache tag is escaped');
  });
});
