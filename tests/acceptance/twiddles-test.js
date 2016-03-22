import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';

module('Acceptance | twiddles', {
  beforeEach: function() {
    this.application = startApp();

    server.create('user', 'octocat');
    const owner = server.create('owner', {login: 'octocat'});
    const file = server.create('gist-file', {
      login: "octocat",
      filename: "twiddle.json",
      content: '{ "dependencies": {} }'
    });
    server.create('gist', {
      id: '35de43cb81fc35ddffb2',
      owner: owner,
      files: [file]
    });
    server.create('gist', {
      id: '74bae9a34142370ff5a3',
      owner: owner,
      files: [file]
    });

    stubValidSession(this.application, {
      "github-oauth2": {}
    });

    this.cacheConfirm = window.confirm;
    window.confirm = Ember.K;
  },

  afterEach: function() {
    window.confirm = this.cacheConfirm;
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /twiddles', function(assert) {
  assert.expect(5);

  visit('/twiddles');

  andThen(function() {
    assert.equal($('.saved-twiddles-header').text().trim(), "My Saved Twiddles");

    assert.equal($('.saved-twiddles tr').length, 2);
    assert.equal($('.saved-twiddles tr').eq(0).find('.test-gist-id').text().trim(), '35de43cb81fc35ddffb2');
    assert.equal($('.saved-twiddles tr').eq(1).find('.test-gist-id').text().trim(), '74bae9a34142370ff5a3');

    click($('.saved-twiddles tr').eq(0).find('.test-gist-twiddle-link>a'));
  });

  andThen(function() {
    assert.equal(currentURL(), '/35de43cb81fc35ddffb2', 'Able to click on a twiddle and go to the twiddle');
  });
});

test('a new twiddle can be created via File menu', function(assert) {
  visit('/twiddles');
  click('.dropdown-menu .test-new-twiddle');

  andThen(function() {
    assert.equal(currentURL(), '/', 'Empty twiddle page is shown');

    // it can be navigated back to the list of twiddles via the user menu
    click('.user-menu .test-show-twiddles');
  });

  andThen(function() {
    assert.equal(currentURL(), '/twiddles');
  });
});

test('signing out navigates to the new twiddle route', function(assert) {
  visit('/twiddles');
  click('.user-menu .test-sign-out');

  andThen(function() {
    assert.equal(currentURL(), '/', 'Empty twiddle page is shown');
  });
});
