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

  this.$('.signin-btn').click();

  assert.ok(this.signInViaGithubCalled, 'signInViaGithub was called');
});
