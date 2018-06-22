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
  await click('.CodeMirror-code');

  let [firstNode] = find('.cm-property');

  await triggerEvent(firstNode, 'keypress', {
    keyCode: '65', // 'A'
    metaKey: true
  });

  await triggerEvent(firstNode, 'keypress', {
    keyCode: '191',   // '/'
    metaKey: true
  });

  let [firstLine] = find('.CodeMirror-line');

  let content = firstLine.textContent;

  assert.ok(content.startsWith('//'), 'Line has been commented');
});
