import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | title input', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('user', { login: 'octocat' });
  });

  const descriptionInput = "input.test-description-input";

  test('Changing gist description changes document title', async function(assert) {
    await visit('/');

    assert.equal(document.title, "Ember Twiddle - New Twiddle");

    await fillIn(descriptionInput, "New Gist Description");
    assert.equal(document.title, "Ember Twiddle - New Gist Description");
  });
});
