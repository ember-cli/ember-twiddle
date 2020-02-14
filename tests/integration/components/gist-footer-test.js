import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupRouter from '../../helpers/setup-router';

module('Integration | Component | gist footer', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      setupRouter(this);
    };
  });

  test('it renders with author and fork', async function(assert) {

    this.set('model', EmberObject.create({
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

    await render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

    assert.equal(this.$('footer').text().trim().replace(/[\t\n\s]+/g, " "), 'Author: octocat | Fork from: romgere \'s gist | Open original gist');

    assert.equal(this.$('footer .user-link').length, 2);

    assert.equal(this.$('footer a:last-child').attr('href'), '/fakegistid');

  });

  test('it renders with author and no fork', async function(assert) {

    this.set('model', EmberObject.create({
      owner: {
        login: 'octocat',
        avatarUrl16: 'fake16.png',
        htmlUrl: 'https://github.com/octocat'
      },
      forkOf: null
    }));

    await render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

    assert.equal(this.$('footer').text().trim().replace(/[\t\n\s]+/g, " "), 'Author: octocat');
    assert.equal(this.$('footer .user-link').length, 1);
    assert.equal(this.$('footer a').length, 1);

  });

  test('it renders without author (new twiddle)', async function(assert) {

    this.set('model', EmberObject.create({
      owner: null,
      forkOf: null
    }));

    await render(hbs`{{gist-footer owner=model.owner originalGist=model.forkOf}}`);

    assert.equal(this.$('footer').text().trim().replace(/[\t\n\s]+/g, " "), 'No author (new twiddle)');

    assert.equal(this.$('footer a').length, 0);
  });
});
