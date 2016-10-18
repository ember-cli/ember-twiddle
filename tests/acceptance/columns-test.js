import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | columns', {
  beforeEach: function() {
    server.create('user', { login: 'octocat' });
  }
});

const columns = ".code";
const firstColumn = ".code:eq(0)";
const plusGlyph = ".code .glyphicon-plus";
const removeGlyph = firstColumn + " .glyphicon-remove";
const outputPlusGlyph = ".output .glyphicon-plus";
const showFileTreeGlyph = firstColumn + " .glyphicon-chevron-right";
const hideFileTreeGlyph = ".twiddle-pane:first-of-type .glyphicon-chevron-left";

test('you can add and remove columns', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(find(columns).length, 1, 'There is one column to start');
    assert.ok(find(firstColumn).hasClass('active'), 'The first column starts out active');

    find(plusGlyph).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=2'), 'We are on the correct route for 2 columns');
    assert.equal(find(columns).length, 2, 'There are now 2 columns');
    assert.ok(urlHas("openFiles=controllers.application.js,templates.application.hbs"),
      "URL contains correct openFiles query parameter 1");

    find(plusGlyph).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=3'), 'We are on the correct route for 3 columns');
    assert.equal(find(columns).length, 3, 'There are now 3 columns');
    assert.ok(urlHas("openFiles=controllers.application.js,templates.application.hbs,twiddle.json"),
      "URL contains correct openFiles query parameter 1");

    find(removeGlyph).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=2'), 'We are on the correct route for 2 columns');
    assert.equal(find(columns).length, 2, 'There are now 2 columns');
    assert.ok(urlHas("openFiles=templates.application.hbs,twiddle.json"),
      "URL contains correct openFiles query parameter 2");

    find(removeGlyph).click();
  });

  andThen(function() {
    assert.ok(!urlHas('numColumns'), 'We are on the correct route for 1 columns');
    assert.equal(find(columns).length, 1, 'There are now 1 columns');
    assert.ok(urlHas("openFiles=twiddle.json"), "URL contains correct openFiles query parameter 3");

    find(removeGlyph).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=0'), 'We are on the correct route for 0 columns');
    assert.equal(find(columns).length, 0, 'There are now 0 columns');
    assert.ok(!urlHas("openFiles"), "URL does not contain openFiles query parameter");

    find(outputPlusGlyph).click();
  });

  andThen(function() {
    assert.ok(!urlHas('numColumns'), 'We are on the correct route for 1 columns');
    assert.equal(find(columns).length, 1, 'There are now 1 columns');

    assert.equal(find(".file-tree").length, 1, "The file tree is shown");
    assert.ok(!urlHas('fileTreeShown'), 'We are on the correct route when file tree is shown');

    find(hideFileTreeGlyph).click();
  });

  andThen(function() {
    assert.ok(urlHas('fileTreeShown=false'), 'We are on the correct route when file tree is shown');
    assert.equal(find(".file-tree").length, 0, "The file tree is hidden");

    find(showFileTreeGlyph).click();
  });

  andThen(function() {
    assert.equal(find(".file-tree").length, 1, "The file tree is shown");
    assert.ok(!urlHas('fileTreeShown'), 'We are on the correct route when file tree is shown');
  });
});

function urlHas(text) {
  return decodeURIComponent(window.location.search).indexOf(text) > 0;
}
