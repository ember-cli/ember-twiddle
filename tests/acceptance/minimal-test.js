import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | minimal');

test('Able to do load a minimal gist', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: "Hello, World!"
    }
  ];

  runGist(files);

  andThen(function() {
    const outputDiv = 'div';

    assert.equal(outputContents(outputDiv), 'Hello, World!', 'Minimal gist is displayed');
  });
});
