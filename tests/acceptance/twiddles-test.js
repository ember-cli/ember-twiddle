import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import $ from 'jquery';

module('Acceptance | twiddles', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  
  hooks.beforeEach(function() {
    server.create('user', { login: 'octocat' });
    const owner = server.create('owner', {login: 'octocat'});
    const file1 = server.create('gist-file', {
      login: "octocat",
      filename: "twiddle.json",
      content: '{ "dependencies": {} }'
    });
    const file2 = server.create('gist-file', {
      login: "octocat",
      filename: "twiddle.json",
      content: '{ "dependencies": {} }'
    });
    const gist1 = server.create('gist', {
      id: '35de43cb81fc35ddffb2'
    });
    gist1.update({
      owner,
      files: [file1]
    });
    const gist2 = server.create('gist', {
      id: '74bae9a34142370ff5a3'
    });
    gist2.update({
      owner,
      files: [file2]
    });

    stubValidSession(this, {
      "github-oauth2": {}
    });

    this.cacheConfirm = window.confirm;
    window.confirm = function() {};
  });

  hooks.afterEach(function() {
    window.confirm = this.cacheConfirm;
  });

  test('visiting /twiddles', async function(assert) {
    assert.expect(5);

    await visit('/twiddles');

    assert.equal($('.saved-twiddles-header').text().trim(), "My Saved Twiddles");

    assert.equal($('.saved-twiddles tr').length, 2);
    assert.equal($('.saved-twiddles tr').eq(0).find('.test-gist-id').text().trim(), '35de43cb81fc35ddffb2');
    assert.equal($('.saved-twiddles tr').eq(1).find('.test-gist-id').text().trim(), '74bae9a34142370ff5a3');

    await click($('.saved-twiddles tr').eq(0).find('.test-gist-twiddle-link>a'));
    assert.equal(currentURL(), '/35de43cb81fc35ddffb2', 'Able to click on a twiddle and go to the twiddle');
  });

  test('a new twiddle can be created via File menu', async function(assert) {
    await visit('/twiddles');
    await click('.dropdown-menu .test-new-twiddle');

    assert.equal(currentURL(), '/', 'Empty twiddle page is shown');

    // it can be navigated back to the list of twiddles via the user menu
    await click('.user-menu .test-show-twiddles');
    assert.equal(currentURL(), '/twiddles');
  });

  test('signing out navigates to the new twiddle route', async function(assert) {
    await visit('/twiddles');
    await click('.user-menu .test-sign-out');

    assert.equal(currentURL(), '/', 'Empty twiddle page is shown');
  });
});
