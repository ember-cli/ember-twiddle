import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';

module('Acceptance | code comment', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('checks javascript comment option', async function(assert) {
    const files = [
      {
        filename: "application.controller.js",
        content: `import Ember from "ember";
                  export default Ember.Controller.extend({
                    appName: 'Ember Twiddle'
                  });`
      },
      {
        filename: "application.template.hbs",
        content: "Welcome to {{appName}}"
      }
    ];


    await await runGist(files);

    let textboxNode = '.CodeMirror textarea';
    await click(textboxNode);

    await triggerEvent(textboxNode, 'keydown', {
      keyCode: 65, // 'A'
      metaKey: true
    });

    await triggerEvent(textboxNode, 'keydown', {
      keyCode: 191, // '/'
      metaKey: true
    });

    let [firstLine] = find('.CodeMirror-line');
    let content = firstLine.textContent;

    assert.ok(content.startsWith('//'), 'Line has been commented');

    await triggerEvent(textboxNode, 'keydown', {
      keyCode: 191, // '/'
      metaKey: true
    });

    [firstLine] = find('.CodeMirror-line');
    content = firstLine.textContent;

    assert.notOk(content.startsWith('//'), 'Line has been uncommented');

  });
});
