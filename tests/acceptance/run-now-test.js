import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | run now');

test('Able to reload the Twiddle', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: `{{input value="initial value"}}`
    }
  ];

  runGist(files);

  click("#live-reload");

  andThen(function() {
    assert.equal(outputPane().find('input').val(), 'initial value');

    outputPane().find('input').val('new value');
  });

  andThen(function() {
    assert.equal(outputPane().find('input').val(), 'new value');

    click(".run-now");
    waitForUnloadedIFrame();
    waitForLoadedIFrame();
  });

  andThen(function() {
    assert.equal(outputPane().find('input').val(), 'initial value');
  });
});
