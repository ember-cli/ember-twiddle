import { test } from 'qunit';
import wait from 'ember-test-helpers/wait';
import testSelector from 'ember-test-selectors';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { clickTrigger, selectOption, nativeClick } from 'ember-twiddle/tests/helpers/paper-helpers';

moduleForAcceptance('Acceptance | columns', {
  beforeEach: function() {
    server.create('user', { login: 'octocat' });
  }
});

const columns = testSelector('columns');
const firstColumn = testSelector('columns', '1');
const firstColumnActionsMenu = testSelector('column-actions-menu', '1');
const addColumnButton = testSelector('column-add-panel') + ' button';
const removeColumnButton = testSelector('column-remove-panel') + ' button';
const firstRemoveColumnButton = firstColumn + ' ' + removeColumnButton;
const outputAddColumnButton = '.output ' + addColumnButton;

test('you can add columns', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(find(columns).length, 1, 'There is one column to start');
    assert.ok(find(firstColumn).hasClass('active'), 'The first column starts out active');

    return wait()
      .then(() => clickTrigger(find(firstColumnActionsMenu).get(0)))
      .then(() => nativeClick(find(addColumnButton).get(0)))
      .then(() => {
        assert.ok(urlHas(currentURL(), 'numColumns=2'), 'We are on the correct route for 2 columns');
        assert.equal(find(columns).length, 2, 'There are now 2 columns');
        assert.ok(urlHas(currentURL(), 'openFiles=controllers.application.js,templates.application.hbs'),
          'URL contains correct openFiles query parameter 1');
      });
  });
});

test('you can remove columns', function(assert) {  
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(find(columns).length, 1, 'There is one column to start');
    assert.ok(find(firstColumn).hasClass('active'), 'The first column starts out active');

    return wait()
      .then(() => clickTrigger(find(firstColumnActionsMenu).get(0)))
      .then(() => nativeClick(find(removeColumnButton).get(0)))
      .then(() => {
        assert.ok(urlHas(currentURL(), 'numColumns=0'), 'We are on the correct route for 0 columns');
        assert.equal(find(columns).length, 0, 'There are now 0 columns');
      });
  });
});

function urlHas(url, text) {
  return url.indexOf(text) > 0;
}
