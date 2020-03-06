import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user menu', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(async function() {
    this.signInViaGithubCalled = false;
    this.signOutCalled = false;
    this.showTwiddlesCalled = false;

    this.set('session', EmberObject.create({
      isOpening: false,
      isAuthenticated: false,
      currentUser: {
        login: 'octocat',
        avatarUrl32: 'fake.png'
      }
    }));

    this.signInViaGithub = () => { this.signInViaGithubCalled = true; };
    this.signOut = () => { this.signOutCalled = true; };
    this.showTwiddles = () => { this.showTwiddlesCalled = true; };

    await render(hbs`{{user-menu session=this.session
                                signInViaGithub=this.signInViaGithub
                                signOut=this.signOut
                                showTwiddles=this.showTwiddles}}`);
  });

  test('it calls signInViaGithub upon clicking Sign In', async function(assert) {
    assert.expect(1);

    await click('.test-sign-in');

    assert.ok(this.signInViaGithubCalled, 'signInViaGithub was called');
  });

  test('it calls signOut upon clicking Sign Out', async function(assert) {
    assert.expect(1);

    this.set('session.isAuthenticated', true);
    await click('.test-sign-out');

    assert.ok(this.signOutCalled, 'signOut was called');
  });

  test('it calls showTwiddles upon clicking "My Saved Twiddles"', async function(assert) {
    assert.expect(1);

    this.set('session.isAuthenticated', true);
    await click('.test-show-twiddles');

    assert.ok(this.showTwiddlesCalled, 'showTwiddles was called');
  });

  test('shows no current version link when in development environment', async function(assert) {
    await render(hbs`{{user-menu}}`);

    assert.equal(this.$('.test-current-version-link').length, 0);
  });

  test('shows link to release when in production environment', async function(assert) {
    await render(hbs`{{user-menu environment="production" version="4.0.4" }}`);

    assert.equal(this.$('.test-current-version-link').length, 1);
    assert.equal(this.$('.test-current-version-link').attr('href'), "https://github.com/ember-cli/ember-twiddle/releases/tag/v4.0.4");
    assert.equal(this.$('.test-current-version-link').text().trim(), "Ember Twiddle v4.0.4");
  });

  test('shows link to commit when in staging environment', async function(assert) {
    await render(hbs`{{user-menu environment="staging" version="4.0.4-abc" currentRevision="abcdefg" }}`);

    assert.equal(this.$('.test-current-version-link').length, 1);
    assert.equal(this.$('.test-current-version-link').attr('href'), "https://github.com/ember-cli/ember-twiddle/commit/abcdefg");
    assert.equal(this.$('.test-current-version-link').text().trim(), "Ember Twiddle v4.0.4-abc");
  });
});
