import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';

module('Acceptance | twiddles', {
  beforeEach: function() {
    this.application = startApp();

    server.create('user', 'octocat');

    stubValidSession(this.application, {
      "github-oauth2": {}
    });
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /twiddles', function(assert) {
  visit('/twiddles');

  andThen(function() {
    assert.equal($('h1.test-twiddles-header').text().trim(), "My Saved Twiddles");
  });

});
