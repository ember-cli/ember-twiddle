import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-profile-link', 'Integration | Component | user profile link', {
  integration: true
});

test('it renders', function(assert) {

  this.set('user', EmberObject.create({
    login: 'octocat',
    avatarUrl16: 'fake16.png',
    htmlUrl: 'https://github.com/octocat'
  }));

  this.render(hbs`{{user-profile-link user=user}}`);

  assert.equal(this.$().text().trim(), 'octocat');

  assert.equal(this.$('.user-link').attr('target'), '_blank');
  assert.equal(this.$('.user-link').attr('href'), 'https://github.com/octocat');
  assert.equal(this.$('.user-link > img').attr('src'), 'fake16.png');
});
