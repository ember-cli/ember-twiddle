import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click, currentRouteName } from '@ember/test-helpers';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';

module('Acceptance | delete gist', function(hooks) {
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

  test('can delete a gist', async function(assert) {
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

    await click('.test-delete-action');

    assert.equal(currentRouteName(), 'gist.new', 'New twiddle created');
  });
});
