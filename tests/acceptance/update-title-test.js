import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

module('Acceptance | title input', {
  beforeEach: function() {
    this.application = startApp();

    server.create('user', 'octocat');
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
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
