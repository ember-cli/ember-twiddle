import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import { faker } from 'ember-cli-mirage';

moduleForAcceptance('Acceptance | fork gist', {
  beforeEach: function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;
    this.cacheRandom = faker.random;
    faker.seed(0.1);

    server.create('user', 'octocat');
  },

  afterEach: function() {
    window.confirm = this.cacheConfirm;
    faker.random = this.cacheRandom;
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
    assert.ok(route === '/89bd9d8d-69a6-474e-8f46-7cc8796ed151');
  });
});
