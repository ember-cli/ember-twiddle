import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | run now', function(hooks) {
  setupApplicationTest(hooks);

  const files = [
    {
      filename: "application.template.hbs",
      content: `{{input value="initial value"}}`
    }
  ];

  test('Able to reload the Twiddle', async function(assert) {
    runGist(files);

    await click("#live-reload");

    assert.equal(outputPane().find('input').val(), 'initial value');

    outputPane().find('input').val('new value');
    assert.equal(outputPane().find('input').val(), 'new value');

    await click(".run-now");
    waitForUnloadedIFrame();
    waitForLoadedIFrame();
    assert.equal(outputPane().find('input').val(), 'initial value');
  });

  test('Reload the Twiddle on command (Cmd+Enter)', async(assert) => {

    runGist(files);

    await click("#live-reload");
    assert.equal(outputPane().find('input').val(), 'initial value');
    
    await outputPane().find('input').val('new value');
    assert.equal(outputPane().find('input').val(), 'new value');

    await keyDown('Enter+cmd'); // eslint-disable-line no-undef

    await waitForUnloadedIFrame();
    await waitForLoadedIFrame();

    assert.equal(outputPane().find('input').val(), 'initial value');
  });
});
