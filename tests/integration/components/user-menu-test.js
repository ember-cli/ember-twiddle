import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-menu', 'Integration | Component | user menu', {
  integration: true,
  beforeEach() {
    this.signInViaGithubCalled = false;
    this.signOutCalled = false;
    this.showTwiddlesCalled = false;

    this.set('session', Ember.Object.create({
      isOpening: false,
      isAuthenticated: false,
      currentUser: {
        login: 'octocat',
        avatarUrl32: 'fake.png'
      }
    }));

    this.on('signInViaGithub', () => { this.signInViaGithubCalled = true; });
    this.on('signOut', () => { this.signOutCalled = true; });
    this.on('showTwiddles', () => { this.showTwiddlesCalled = true; });

    this.render(hbs`{{user-menu session=session
                                signInViaGithub=(action "signInViaGithub")
                                signOut=(action "signOut")
                                showTwiddles=(action "showTwiddles")}}`);
  }
});

test('it calls signInViaGithub upon clicking Sign In', function(assert) {
  assert.expect(1);

  this.$('.test-sign-in').click();

  assert.ok(this.signInViaGithubCalled, 'signInViaGithub was called');
});

test('it calls signOut upon clicking Sign Out', function(assert) {
  assert.expect(1);

  this.set('session.isAuthenticated', true);
  this.$('.test-sign-out').click();

  assert.ok(this.signOutCalled, 'signOut was called');
});

test('it calls showTwiddles upon clicking "My Saved Twiddles"', function(assert) {
  assert.expect(1);

  this.set('session.isAuthenticated', true);
  this.$('.test-show-twiddles').click();

  assert.ok(this.showTwiddlesCalled, 'showTwiddles was called');
});

test('shows no current version link when in development environment', function(assert) {
  this.render(hbs`{{user-menu}}`);

  assert.equal(this.$('.test-current-version-link').length, 0);
});

test('shows link to release when in production environment', function(assert) {
  this.render(hbs`{{user-menu environment="production" version="4.0.4" }}`);

  assert.equal(this.$('.test-current-version-link').length, 1);
  assert.equal(this.$('.test-current-version-link').attr('href'), "https://github.com/ember-cli/ember-twiddle/releases/tag/4.0.4");
  assert.equal(this.$('.test-current-version-link').text().trim(), "Ember Twiddle v4.0.4");
});

test('shows link to commit when in staging environment', function(assert) {
  this.render(hbs`{{user-menu environment="staging" version="4.0.4-abc" currentRevision="abcdefg" }}`);

  assert.equal(this.$('.test-current-version-link').length, 1);
  assert.equal(this.$('.test-current-version-link').attr('href'), "https://github.com/ember-cli/ember-twiddle/commit/abcdefg");
  assert.equal(this.$('.test-current-version-link').text().trim(), "Ember Twiddle v4.0.4-abc");
});
