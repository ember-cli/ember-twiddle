import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import runGist from '../helpers/run-gist';

module('Acceptance | save gist', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;

    server.create('user', { login: 'octocat' });
  });

  hooks.afterEach(function() {
    window.confirm = this.cacheConfirm;
  });

  test('can save a gist with an id', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this.application, {
      currentUser: {login: "Gaurav0"},
      "github-oauth2": {}
    });

    await runGist([
      {
        filename: 'application.template.hbs',
        content: 'hello world!'
      }
    ]);

    await visit('/35de43cb81fc35ddffb2');

    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");

    await fillIn('.title input', "my twiddle");

    assert.equal(find('.title input').val(), "my twiddle");
    assert.equal(find('.test-unsaved-indicator').length, 1, "Changing title triggers unsaved indicator");

    await click('.test-save-action');

    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });

  test('can save a gist without an id', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this.application, {
      currentUser: {login: "Gaurav0"},
      "github-oauth2": {}
    });

    await visit('/');

    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");

    await fillIn('.title input', "my twiddle");

    assert.equal(find('.title input').val(), "my twiddle");
    assert.equal(find('.test-unsaved-indicator').length, 1, "Changing title triggers unsaved indicator");

    await click('.test-save-action');

    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });

  test('gist save on cmd+s shortcut', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this.application, {
      currentUser: { login: "gokatz" },
      "github-oauth2": {}
    });

    await visit('/');
    assert.equal(find('.gist-link').length, 0, "No gist link is displayed for unsaved twiddle");

    await keyDown('cmd+KeyS'); // eslint-disable-line no-undef

    assert.equal(find('.gist-link').length, 1, "Gist link is shown for saved twiddle");
  });
});
