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
      content: ''
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
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /twiddles', function(assert) {
  assert.expect(4);

  visit('/twiddles');

  andThen(function() {
    assert.equal($('h1.test-twiddles-header').text().trim(), "My Saved Twiddles");

    assert.equal($('.saved-twiddles tr').length, 2);
    assert.equal($('.saved-twiddles tr').eq(0).find('.test-gist-id').text().trim(), '35de43cb81fc35ddffb2');
    assert.equal($('.saved-twiddles tr').eq(1).find('.test-gist-id').text().trim(), '74bae9a34142370ff5a3');
  });
});
