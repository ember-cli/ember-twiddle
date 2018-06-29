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

test('Reload the Twiddle on command (Cmd+Enter)', async(assert) => {

  const files = [
    {
      filename: "application.template.hbs",
      content: `{{input value="initial value"}}`
    }
  ];

  runGist(files);

  await click("#live-reload");
  assert.equal(outputPane().find('input').val(), 'initial value');
  
  await outputPane().find('input').val('new value');
  assert.equal(outputPane().find('input').val(), 'new value');

  let textareaNode = '.CodeMirror textarea';
  await click(textareaNode);
  await triggerEvent(textareaNode, 'keydown', {
    keyCode: 13, // 'Enter'
    metaKey: true
  });

  await waitForUnloadedIFrame();
  await waitForLoadedIFrame();

  assert.equal(outputPane().find('input').val(), 'initial value');
});
