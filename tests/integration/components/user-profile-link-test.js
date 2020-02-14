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

    assert.equal(this.$().text().trim(), 'octocat');

    assert.equal(this.$('.user-link').attr('target'), '_blank');
    assert.equal(this.$('.user-link').attr('href'), 'https://github.com/octocat');
    assert.equal(this.$('.user-link > img').attr('src'), 'fake16.png');
  });
});
