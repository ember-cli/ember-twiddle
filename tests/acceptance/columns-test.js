import { find, findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | columns', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('user', { login: 'octocat' });
  });

  const columns = ".code";
  const firstColumn = ".code:eq(0)";
  const plusGlyph = ".code .glyphicon-plus";
  const removeGlyph = firstColumn + " .glyphicon-remove";
  const outputPlusGlyph = ".output .glyphicon-plus";
  const showFileTreeGlyph = firstColumn + " .glyphicon-chevron-right";
  const hideFileTreeGlyph = ".twiddle-pane:first-of-type .glyphicon-chevron-left";

  test('you can add and remove columns', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(findAll(columns).length, 1, 'There is one column to start');
    assert.ok(find(firstColumn).classList.contains('active'), 'The first column starts out active');

    find(plusGlyph).click();
    assert.ok(urlHas('numColumns=2'), 'We are on the correct route for 2 columns');
    assert.equal(findAll(columns).length, 2, 'There are now 2 columns');
    assert.ok(urlHas("openFiles=controllers.application\\.js,templates.application\\.hbs"),
      "URL contains correct openFiles query parameter 1");

    find(plusGlyph).click();
    assert.ok(urlHas('numColumns=3'), 'We are on the correct route for 3 columns');
    assert.equal(findAll(columns).length, 3, 'There are now 3 columns');
    assert.ok(urlHas("openFiles=controllers.application\\.js,templates.application\\.hbs,twiddle\\.json"),
      "URL contains correct openFiles query parameter 1");

    find(removeGlyph).click();
    assert.ok(urlHas('numColumns=2'), 'We are on the correct route for 2 columns');
    assert.equal(findAll(columns).length, 2, 'There are now 2 columns');
    assert.ok(urlHas("openFiles=templates.application\\.hbs,twiddle\\.json"),
      "URL contains correct openFiles query parameter 2");

    find(removeGlyph).click();
    assert.ok(!urlHas('numColumns'), 'We are on the correct route for 1 columns');
    assert.equal(findAll(columns).length, 1, 'There are now 1 columns');
    assert.ok(urlHas("openFiles=twiddle\\.json"), "URL contains correct openFiles query parameter 3");

    find(removeGlyph).click();
    assert.ok(urlHas('numColumns=0'), 'We are on the correct route for 0 columns');
    assert.equal(findAll(columns).length, 0, 'There are now 0 columns');
    assert.ok(!urlHas("openFiles"), "URL does not contain openFiles query parameter");

    find(outputPlusGlyph).click();
    assert.ok(!urlHas('numColumns'), 'We are on the correct route for 1 columns');
    assert.equal(findAll(columns).length, 1, 'There are now 1 columns');

    assert.equal(findAll(".file-tree").length, 1, "The file tree is shown");
    assert.ok(!urlHas('fileTreeShown'), 'We are on the correct route when file tree is shown');

    find(hideFileTreeGlyph).click();
    assert.ok(urlHas('fileTreeShown=false'), 'We are on the correct route when file tree is shown');
    assert.equal(findAll(".file-tree").length, 0, "The file tree is hidden");

    find(showFileTreeGlyph).click();
    assert.equal(findAll(".file-tree").length, 1, "The file tree is shown");
    assert.ok(!urlHas('fileTreeShown'), 'We are on the correct route when file tree is shown');
  });

  function urlHas(text) {
    return decodeURIComponent(currentURL()).indexOf(text) > 0;
  }
});
