import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { Service, RSVP } = Ember;

module('Integration | Component | user profile', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(async function() {
    this.set('session', Ember.Object.create({
      isOpening: false,
      isAuthenticated: true,
      currentUser: {
        login: 'octocat',
        avatarUrl32: 'fake.png'
      }
    }));

    this.actions.signOut = () => { this.signOutCalled = true; };
    this.actions.showTwiddles = () => { this.showTwiddlesCalled = true; };

    this.owner.register('service:session', Service.extend());

    this.container
    .registry
    .registrations['helper:route-action'] = Ember.Helper.helper(() => {
      return function(arg) {
        return RSVP.resolve(arg);
      };
    });

    await render(hbs`{{user-profile session=session
                                signOut=(action "signOut")
                                showTwiddles=(action "showTwiddles")}}`)
  });

  test('it renders', function(assert) {
    assert.dom('.user-info').hasText('Logged in as octocat');
  });

  test('it calls signOut upon clicking Sign Out', async function(assert) {
    assert.expect(1);

    await click('[data-test-sign-out]');

    assert.ok(this.signOutCalled, 'Expected signOut to be called');
  });

  test('it calls showTwiddles upon clicking "My Saved Twiddles"', async function(assert) {
    assert.expect(1);

    await click('[data-test-show-twiddles]');

    assert.ok(this.showTwiddlesCalled, 'Expected showTwiddles to be called');
  });

  test('shows no current version link when in development environment', function(assert) {
    assert.dom('.test-current-version-link').doesNotExist();
  });

  test('shows link to release when in production environment', async function(assert) {
    await render(hbs`{{user-profile environment="production" version="4.0.4" }}`);

    const $versionLink = this.$('[data-test-current-version-link]');

    assert.equal($versionLink.length, 1);
    assert.equal($versionLink.attr('href'), "https://github.com/ember-cli/ember-twiddle/releases/tag/v4.0.4");
    assert.equal($versionLink.text().trim(), "open_in_new Ember Twiddle v4.0.4");
  });

  test('shows link to commit when in staging environment', async function(assert) {
    await render(hbs`{{user-profile environment="staging" version="4.0.4-abc" currentRevision="abcdefg" }}`);

    const $versionLink = this.$('[data-test-current-version-link]');


    assert.equal($versionLink.length, 1);
    assert.equal($versionLink.attr('href'), "https://github.com/ember-cli/ember-twiddle/commit/abcdefg");
    assert.equal($versionLink.text().trim(), "open_in_new Ember Twiddle v4.0.4-abc");
  });
});
