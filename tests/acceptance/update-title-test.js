import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | title input', {
  beforeEach: function() {
    server.create('user', { login: 'octocat' });
  }
});

const descriptionInput = "input.test-description-input";

test('Changing gist description changes document title', function(assert) {
  visit('/');

  andThen(() => {
    assert.equal(document.title, "Ember Twiddle - New Twiddle");

    fillIn(descriptionInput, "New Gist Description");
  });

  andThen(() => {
    assert.equal(document.title, "Ember Twiddle - New Gist Description");
  });
});
