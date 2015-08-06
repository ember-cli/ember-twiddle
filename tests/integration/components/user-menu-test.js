import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-menu', 'Integration | Component | user menu', {
  integration: true,
  beforeEach() {
    this.signInViaGithubCalled = false;
    this.signOutCalled = false;

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

    this.render(hbs`{{user-menu session=session
                                version=version
                                signInViaGithub="signInViaGithub"
                                signOut="signOut"}}`);
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
