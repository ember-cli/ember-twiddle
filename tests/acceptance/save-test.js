import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';

moduleForAcceptance('Acceptance | save gist', {
  beforeEach: function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;

    server.create('user', { login: 'octocat' });
  },

  afterEach: function() {
    window.confirm = this.cacheConfirm;
  }
});

test('can save a gist with an id', function(assert) {
  // set owner of gist as currently logged in user
  stubValidSession(this.application, {
    currentUser: {login: "Gaurav0"},
    "github-oauth2": {}
  });

  runGist([
    {
      filename: 'application.template.hbs',
      content: 'hello world!'
    }
  ]);

  visit('/35de43cb81fc35ddffb2');

  andThen(function () {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });

  fillIn('.title input', "my twiddle");

  andThen(function() {
    assert.equal(find('.title input').val(), "my twiddle");
    assert.equal(find('.test-unsaved-indicator').length, 1, "Changing title triggers unsaved indicator");
  });

  click('.test-save-action');

  andThen(function() {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });
});

test('can save a gist without an id', function(assert) {
  // set owner of gist as currently logged in user
  stubValidSession(this.application, {
    currentUser: {login: "Gaurav0"},
    "github-oauth2": {}
  });

  visit('/');

  andThen(function () {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });

  fillIn('.title input', "my twiddle");

  andThen(function() {
    assert.equal(find('.title input').val(), "my twiddle");
    assert.equal(find('.test-unsaved-indicator').length, 1, "Changing title triggers unsaved indicator");
  });

  click('.test-save-action');

  andThen(function() {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });
});

test('gist save on cmd+s shortcut', async function(assert) {
  // set owner of gist as currently logged in user
  stubValidSession(this.application, {
    currentUser: { login: "gokatz" },
    "github-oauth2": {}
  });

  await visit('/');
  assert.equal(find('.gist-link').length, 0, "No gist link is displayed for unsaved twiddle");

  let textareaNode = '.CodeMirror textarea';
  await triggerEvent(textareaNode, 'keydown', {
    keyCode: 83, // 'S'
    metaKey: true
  });

  assert.equal(find('.gist-link').length, 1, "Gist link is shown for saved twiddle");
});
