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
const firstColumn = ".code:nth-of-type(2)";
const plusGlyph = ".code .glyphicon-plus";
const removeGlyph = firstColumn + " .glyphicon-remove";
const outputPlusGlyph = ".output .glyphicon-plus";

test('you can add and remove columns', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(find(columns).length, 2, 'There are two columns to start');

    find(plusGlyph).click();
  });

  andThen(function() {
    assert.equal(currentURL(), '/?numColumns=3', 'We are on the correct route for 3 columns');
    assert.equal(find(columns).length, 3, 'There are now 3 columns');

    find(removeGlyph).click();
  });

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct route for 2 columns');
    assert.equal(find(columns).length, 2, 'There are now 2 columns');

    find(removeGlyph).click();
  });

  andThen(function() {
    assert.equal(currentURL(), '/?numColumns=1', 'We are on the correct route for 1 columns');
    assert.equal(find(columns).length, 1, 'There are now 1 columns');

    find(removeGlyph).click();
  });

  andThen(function() {
    assert.equal(currentURL(), '/?numColumns=0', 'We are on the correct route for 0 columns');
    assert.equal(find(columns).length, 0, 'There are now 0 columns');

    find(outputPlusGlyph).click();
  });

  andThen(function() {
    assert.equal(currentURL(), '/?numColumns=1', 'We are on the correct route for 1 columns');
    assert.equal(find(columns).length, 1, 'There are now 1 columns');
  });
});
