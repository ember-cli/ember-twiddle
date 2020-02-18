import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import setupRouter from '../../helpers/setup-router';

moduleForComponent('owner-info', 'Integration | Component | gist footer', {
  integration: true,
  setup() {
    setupRouter(this);
  }
});

test('it renders with author and fork', function(assert) {

  this.set('model', Ember.Object.create({
    owner: {
      login: 'octocat',
      avatarUrl16: 'fake16.png',
      htmlUrl: 'https://github.com/octocat'
    },
    forkOf: {
      id: 'fakegistid',
      owner: {
        login: 'romgere',
        avatarUrl16: 'fake16.png',
        htmlUrl: 'https://github.com/romgere'
      }
    }
  }));

  this.render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

  assert.equal(this.$('footer').text().trim().replace(/[\t\n\s]+/g, " "), 'Author: octocat | Fork from: romgere \'s gist | Open original gist');

  assert.equal(this.$('footer .user-link').length, 2);

  assert.equal(this.$('footer a:last-child').attr('href'), '/fakegistid');

});

test('it renders with author and no fork', function(assert) {

  this.set('model', Ember.Object.create({
    owner: {
      login: 'octocat',
      avatarUrl16: 'fake16.png',
      htmlUrl: 'https://github.com/octocat'
    },
    forkOf: null
  }));

  this.render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

  assert.equal(this.$('footer').text().trim().replace(/[\t\n\s]+/g, " "), 'Author: octocat');
  assert.equal(this.$('footer .user-link').length, 1);
  assert.equal(this.$('footer a').length, 1);

});

test('it renders without author (new twiddle)', function(assert) {

  this.set('model', Ember.Object.create({
    owner: null,
    forkOf: null
  }));

  this.render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

  assert.equal(this.$('footer').text().trim().replace(/[\t\n\s]+/g, " "), 'No author (new twiddle)');

  assert.equal(this.$('footer a').length, 0);
});
