import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import Mirage from 'ember-cli-mirage';

moduleForAcceptance('Acceptance | fork gist', {
  beforeEach: function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;
    server.create('user', { login: 'octocat' });

    server.post('/gists/:id/forks', () => {
      let gist = server.create('gist', { id: 'bd9d8d69-a674-4e0f-867c-c8796ed151a0' });
      return new Mirage.Response(200, {}, gist);
    });
  },

  afterEach: function() {
    window.confirm = this.cacheConfirm;
  }
});

test('can fork a gist', function(assert) {
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

  visit('/35de43cb81fc35ddffb2');

  andThen(function () {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });

  click('.test-fork-action');

  andThen(function() {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");

    let url = window.location.href;
    let route = url.substr(url.lastIndexOf('/'));
    assert.equal(route, '/bd9d8d69-a674-4e0f-867c-c8796ed151a0');
  });
});
