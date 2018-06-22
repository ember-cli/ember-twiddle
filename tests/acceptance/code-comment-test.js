import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | code comment');

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


  await runGist(files);

  let textboxNode = 'textarea:eq(1)';
  textboxNode = '.CodeMirror textarea';
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
