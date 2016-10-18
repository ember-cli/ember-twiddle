import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';

moduleForAcceptance('Acceptance | delete gist', {
  beforeEach: function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;

    server.create('user', { login: 'octocat' });
  },

  afterEach: function() {
    window.confirm = this.cacheConfirm;
  }
});

test('can delete a gist', function(assert) {
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

  click('.test-delete-action');

  andThen(function() {
    assert.equal(currentRouteName(), 'gist.new', 'New twiddle created');
  });
});
