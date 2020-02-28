import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import { triggerEvent } from '@ember/test-helpers';

module('Acceptance | Sidebar', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Check for context menu', async function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Hello, World!"
      }
    ];

    await runGist(files);

    let selector = '[data-test-file-tree] #application .jstree-children .jstree-anchor';
    await triggerEvent(selector, 'contextmenu');

    assert.dom('[data-test-file-tree] .vakata-context li').exists({ count: 3 }, 'The context menu should contain 3 items')
  });
});
