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
    this.set('version', '0.4.0');

    this.on('signInViaGithub', () => { this.signInViaGithubCalled = true; });
    this.on('signOut', () => { this.signOutCalled = true; });
    this.on('showTwiddles', () => { this.showTwiddlesCalled = true; });

    this.render(hbs`{{user-menu session=session
                                version=version
                                signInViaGithub="signInViaGithub"
                                signOut="signOut"
                                showTwiddles="showTwiddles" }}`);
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
