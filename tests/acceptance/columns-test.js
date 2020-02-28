import { module, test } from 'qunit';
import { visit, currentURL, findAll, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | columns', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    server.create('user', { login: 'octocat' });
  });

  const columns = '[data-test-columns]';
  const firstColumn = '[data-test-columns="1"]';
  const firstColumnActionsMenu = '[data-test-column-actions-menu="1"]';
  const addColumnButton = '[data-test-column-add-panel] button';
  const removeColumnButton = '[data-test-column-remove-panel] button';

  test('you can add columns', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.dom(columns).exists({ count: 1 }, 'There is one column to start');
    assert.dom(firstColumn).hasClass('active', 'The first column starts out active');

    await click(firstColumnActionsMenu);
    await click(addColumnButton);

    assert.ok(urlHas('numColumns=2'), 'We are on the correct route for 2 columns');
    assert.dom(columns).exists({ count: 2 }, 'There are now 2 columns');
    assert.ok(urlHas('openFiles=controllers.application.js,templates.application.hbs'),
      'URL contains correct openFiles query parameter 1');
  });

  test('you can remove columns', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.dom(columns).exists({ count: 1 }, 'There is one column to start');
    assert.dom(firstColumn).hasClass('active', 'The first column starts out active');

    await click(firstColumnActionsMenu);
    await click(removeColumnButton);

    assert.ok(urlHas('numColumns=0'), 'We are on the correct route for 0 columns');
    assert.dom(columns).doesNotExist('There are now 0 columns');
  });

  function urlHas(text) {
    return decodeURIComponent(currentURL()).indexOf(text) > 0;
  }
});