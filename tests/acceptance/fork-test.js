import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import Mirage from 'ember-cli-mirage';

module('Acceptance | fork gist', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;
    server.create('user', { login: 'octocat' });

    server.post('/gists/:id/forks', () => {
      let gist = server.create('gist', { id: 'bd9d8d69-a674-4e0f-867c-c8796ed151a0' });
      return new Mirage.Response(200, {}, gist);
    });
  });

  hooks.afterEach(function() {
    window.confirm = this.cacheConfirm;
  });

  test('can fork a gist', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this.application, {
      currentUser: {login: "octocat"},
      "github-oauth2": {}
    });

    runGist([
      {
        filename: 'application.template.hbs',
        content: 'hello world!'
      }
    ]);

    await visit('/35de43cb81fc35ddffb2');

    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");

    await click('.test-fork-action');

    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");

    let url = currentURL();
    let route = url.substr(url.lastIndexOf('/'));
    assert.equal(route, '/bd9d8d69-a674-4e0f-867c-c8796ed151a0');
  });
});
