import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

module('Acceptance | columns', {
  beforeEach: function() {
    this.application = startApp();

    server.create('user', 'octocat');
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

const columns = ".code";
const firstColumn = ".code:first-of-type";
const plusGlyph = ".code .glyphicon-plus";
const removeGlyph = firstColumn + " .glyphicon-remove";
const outputPlusGlyph = ".output .glyphicon-plus";
const showFileTreeGlyph = firstColumn + " .glyphicon-chevron-right";
const hideFileTreeGlyph = ".col-md-4:first-of-type .glyphicon-chevron-left";

test('you can add and remove columns', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(find(columns).length, 2, 'There are two columns to start');
    assert.ok(find(firstColumn).hasClass('active'), 'The first column starts out active');

    find(plusGlyph).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=3'), 'We are on the correct route for 3 columns');
    assert.equal(find(columns).length, 3, 'There are now 3 columns');
    assert.ok(urlHas("openFiles=application.controller.js,application.template.hbs,twiddle.json"),
      "URL contains correct openFiles query parameter 1");

    find(removeGlyph).click();
  });

  andThen(function() {
    assert.ok(!urlHas('numColumns'), 'We are on the correct route for 2 columns');
    assert.equal(find(columns).length, 2, 'There are now 2 columns');
    assert.ok(urlHas("openFiles=application.template.hbs,twiddle.json"),
      "URL contains correct openFiles query parameter 2");

    find(removeGlyph).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=1'), 'We are on the correct route for 1 columns');
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
    assert.ok(urlHas('numColumns=1'), 'We are on the correct route for 1 columns');
    assert.equal(find(columns).length, 1, 'There are now 1 columns');

    find(showFileTreeGlyph).click();
  });

  andThen(function() {
    assert.equal(find(".file-tree").length, 1, "The file tree is shown");
    assert.ok(urlHas('fileTreeShown=true'), 'We are on the correct route when file tree is shown');

    find(hideFileTreeGlyph).click();
  });

  andThen(function() {
    assert.equal(find(".file-tree").length, 0, "The file tree is hidden");
  });
});

function urlHas(text) {
  return decodeURIComponent(window.location.search).indexOf(text) > 0;
}
