import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import waitForLoadedIFrame from '../helpers/wait-for-loaded-iframe';
import waitForUnloadedIFrame from '../helpers/wait-for-unloaded-iframe';
import outputPane from '../helpers/output-pane';

module('Acceptance | run now', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  const files = [
    {
      filename: "application.template.hbs",
      content: `{{input value="initial value"}}`
    }
  ];

  test('Able to reload the Twiddle', async function(assert) {
    await runGist(files);

    await click("#live-reload");

    assert.equal(outputPane().find('input').val(), 'initial value');

    outputPane().find('input').val('new value');
    assert.equal(outputPane().find('input').val(), 'new value');

    await click(".run-now");
    await waitForUnloadedIFrame();
    await waitForLoadedIFrame();
    assert.equal(outputPane().find('input').val(), 'initial value');
  });

  test('Reload the Twiddle on command (Cmd+Enter)', async(assert) => {

    await runGist(files);

    await click("#live-reload");
    assert.equal(outputPane().find('input').val(), 'initial value');
    
    await outputPane().find('input').val('new value');
    assert.equal(outputPane().find('input').val(), 'new value');

    await keyDown('Enter+cmd'); // eslint-disable-line no-undef

    await await waitForUnloadedIFrame();
    await await waitForLoadedIFrame();

    assert.equal(outputPane().find('input').val(), 'initial value');
  });
});
