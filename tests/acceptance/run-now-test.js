import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click } from '@ember/test-helpers';
import { triggerKeyDown } from 'ember-keyboard';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import waitForLoadedIFrame from '../helpers/wait-for-loaded-iframe';
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

    assert.equal(findInIframe('input').value, 'initial value');

    findInIframe('input').value = 'new value';
    assert.equal(findInIframe('input').value, 'new value');

    await click(".run-now");
    await waitForLoadedIFrame();
    assert.equal(findInIframe('input').value, 'initial value');
  });

  test('Reload the Twiddle on command (Cmd+Enter)', async(assert) => {

    await runGist(files);

    await click("#live-reload");
    assert.equal(findInIframe('input').value, 'initial value');

    findInIframe('input').value = 'new value';
    assert.equal(findInIframe('input').value, 'new value');

    await triggerKeyDown('Enter+cmd');
    await waitForLoadedIFrame();

    assert.equal(findInIframe('input').value, 'initial value');
  });
});

function findInIframe(selector) {
  let iframeWindow = outputPane();
  let el = iframeWindow.document.querySelector(selector);
  return el;
}
