import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
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

    assert.dom('*').hasText('octocat');

    assert.dom('.user-link').hasAttribute('target', '_blank');
    assert.dom('.user-link').hasAttribute('href', 'https://github.com/octocat');
    assert.dom('.user-link > img').hasAttribute('src', 'fake16.png');
  });
});
