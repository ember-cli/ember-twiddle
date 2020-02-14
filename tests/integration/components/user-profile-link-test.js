import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user profile link', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    this.set('user', EmberObject.create({
      login: 'octocat',
      avatarUrl16: 'fake16.png',
      htmlUrl: 'https://github.com/octocat'
    }));

    await render(hbs`{{user-profile-link user=user}}`);

    assert.equal(find('*').textContent.trim(), 'octocat');

    assert.equal(find('.user-link').getAttribute('target'), '_blank');
    assert.equal(find('.user-link').getAttribute('href'), 'https://github.com/octocat');
    assert.equal(find('.user-link > img').getAttribute('src'), 'fake16.png');
  });
});
