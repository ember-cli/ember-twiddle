import { test } from 'qunit';
import wait from 'ember-test-helpers/wait';
import testSelector from 'ember-test-selectors';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { find, findAll, click, visit/*, click, find, fillIn, waitUntil, currentURL*/ } from 'ember-native-dom-helpers';

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

test('you can add columns', function(assert) {
  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(findAll(columns).length, 1, 'There is one column to start');
    assert.ok(find(firstColumn).classList.contains('active'), 'The first column starts out active');

    click(firstColumnActionsMenu);
  });

  andThen(() => {
    click(addColumnButton);
  })

  andThen(() => {
    assert.ok(urlHas(currentURL(), 'numColumns=2'), 'We are on the correct route for 2 columns');
    assert.equal(findAll(columns).length, 2, 'There are now 2 columns');
    assert.ok(urlHas(currentURL(), 'openFiles=controllers.application.js,templates.application.hbs'),
      'URL contains correct openFiles query parameter 1');
  });
});

test('you can remove columns', function(assert) {
  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/', 'We are on the correct initial route');
    assert.equal(findAll(columns).length, 1, 'There is one column to start');
    assert.ok(find(firstColumn).classList.contains('active'), 'The first column starts out active');

    click(firstColumnActionsMenu);
  });

  andThen(() => {
    click(removeColumnButton);
  });

  andThen(() => {
    assert.ok(urlHas(currentURL(), 'numColumns=0'), 'We are on the correct route for 0 columns');
    assert.equal(findAll(columns).length, 0, 'There are now 0 columns');
  });
});

function urlHas(url, text) {
  return decodeURIComponent(url).indexOf(text) > 0;
}
