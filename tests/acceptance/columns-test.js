import { test } from 'qunit';
import testSelector from 'ember-test-selectors';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | columns', {
  beforeEach: function() {
    server.create('user', { login: 'octocat' });
  }
});

const columns = '.code';
const firstColumn = '.code:eq(0)';
const addColumnButton = testSelector('add-panel');
const removeColumnButton = testSelector('remove-panel');
const firstRemoveColumnButton = firstColumn + ' ' + removeColumnButton;
const outputAddColumnButton = '.output ' + addColumnButton;

test('you can add and remove columns', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(find(columns).length, 1, 'There is one column to start');
    assert.ok(find(firstColumn).hasClass('active'), 'The first column starts out active');

    find(addColumnButton).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=2'), 'We are on the correct route for 2 columns');
    assert.equal(find(columns).length, 2, 'There are now 2 columns');
    assert.ok(urlHas('openFiles=controllers.application.js,templates.application.hbs'),
      'URL contains correct openFiles query parameter 1');

    find(addColumnButton).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=3'), 'We are on the correct route for 3 columns');
    assert.equal(find(columns).length, 3, 'There are now 3 columns');
    assert.ok(urlHas('openFiles=controllers.application.js,templates.application.hbs,twiddle.json'),
      'URL contains correct openFiles query parameter 1');

    find(firstRemoveColumnButton).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=2'), 'We are on the correct route for 2 columns');
    assert.equal(find(columns).length, 2, 'There are now 2 columns');
    assert.ok(urlHas('openFiles=templates.application.hbs,twiddle.json'),
      'URL contains correct openFiles query parameter 2');

    find(firstRemoveColumnButton).click();
  });

  andThen(function() {
    assert.ok(!urlHas('numColumns'), 'We are on the correct route for 1 columns');
    assert.equal(find(columns).length, 1, 'There are now 1 columns');
    assert.ok(urlHas('openFiles=twiddle.json'), 'URL contains correct openFiles query parameter 3');

    find(firstRemoveColumnButton).click();
  });

  andThen(function() {
    assert.ok(urlHas('numColumns=0'), 'We are on the correct route for 0 columns');
    assert.equal(find(columns).length, 0, 'There are now 0 columns');
    assert.ok(!urlHas('openFiles'), 'URL does not contain openFiles query parameter');

    find(outputAddColumnButton).click();
  });
});

function urlHas(text) {
  return decodeURIComponent(window.location.search).indexOf(text) > 0;
}
