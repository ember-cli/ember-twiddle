import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click, fillIn, settled } from '@ember/test-helpers';
import { triggerKeyDown } from 'ember-keyboard';
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
    stubValidSession(this, {
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

    assert.dom('[data-test-unsaved-indicator]').doesNotExist("No unsaved indicator shown");

    await fillIn('.title input', "my twiddle");

    assert.dom('.title input').hasValue("my twiddle");
    assert.dom('[data-test-unsaved-indicator]').exists({ count: 1 }, "Changing title triggers unsaved indicator");

    await click('.test-save-action');

    assert.dom('[data-test-unsaved-indicator]').doesNotExist("No unsaved indicator shown");
  });

  test('can save a gist without an id', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this, {
      currentUser: {login: "Gaurav0"},
      "github-oauth2": {}
    });

    await visit('/');

    assert.dom('[data-test-unsaved-indicator]').doesNotExist("No unsaved indicator shown");

    await fillIn('.title input', "my twiddle");

    assert.dom('.title input').hasValue("my twiddle");
    assert.dom('[data-test-unsaved-indicator]').exists({ count: 1 }, "Changing title triggers unsaved indicator");

    await click('.test-save-action');

    assert.dom('[data-test-unsaved-indicator]').doesNotExist("No unsaved indicator shown");
  });

  test('gist save on cmd+s shortcut', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this, {
      currentUser: { login: "gokatz" },
      "github-oauth2": {}
    });

    await visit('/');
    assert.dom('.gist-link').doesNotExist("No gist link is displayed for unsaved twiddle");

    await triggerKeyDown('cmd+KeyS');
    await settled();

    assert.dom('.gist-link').exists({ count: 1 }, "Gist link is shown for saved twiddle");
  });
});
