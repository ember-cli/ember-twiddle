import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import runGist from '../helpers/run-gist';
import runRevision from '../helpers/run-revision';
import waitForLoadedIFrame from '../helpers/wait-for-loaded-iframe';
import waitForUnloadedIFrame from '../helpers/wait-for-unloaded-iframe';
import outputContents from '../helpers/output-contents';

module('Acceptance | gist-revision', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;
  });

  hooks.afterEach(function() {
    window.confirm = this.cacheConfirm;
  });

  test('Able to load a previous revision of a gist', async function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Hello, World!"
      }
    ];

    await runRevision(files);

    assert.equal(outputContents(), 'Hello, World!', 'Previous version of a gist is displayed');
  });

  test('Able to copy a revision into new gist', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this.application, {
      currentUser: { login: "Gaurav0" },
      "github-oauth2": {}
    });

    await runRevision([
      {
        filename: 'application.template.hbs',
        content: 'hello world!'
      }
    ]);

    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");

    await fillIn('.title input', "my twiddle");
    assert.equal(find('.title input').val(), "my twiddle");

    await click("#live-reload");
    await click('.test-copy-action');
    waitForUnloadedIFrame();
    await waitForLoadedIFrame();

    assert.equal(find('.title input').val(), "New Twiddle", "Description is reset");
    assert.equal(find('.test-unsaved-indicator').length, 0, "Unsaved indicator does not appear when gist is copied");
    assert.equal(find('.test-copy-action').length, 0, "Menu item to copy gist is not shown anymore");
    assert.equal(outputContents(), 'hello world!');
  });

  test('Able to go from current version to revision and back via the UI', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this.application, {
      currentUser: { login: "Gaurav0" },
      "github-oauth2": {}
    });

    const files = [
      {
        filename: "application.template.hbs",
        content: "Hello, World!"
      }
    ];

    await runGist(files);

    assert.equal(outputContents(), 'Hello, World!');

    createGist({
      files: [
        {
          filename: "application.template.hbs",
          content: "Hello, ..."
        }
      ],
      type: 'revision',
      commit: "921e8958fe32b5a1b724fa6754d0dd904cfa9e62",
      login: 'octocat',
      doNotCreateGist: true
    });

    await click(".test-version-action");
    waitForUnloadedIFrame();
    await waitForLoadedIFrame();
    assert.equal(outputContents(), 'Hello, ...');

    await click(".test-show-current-version");
    waitForUnloadedIFrame();
    await waitForLoadedIFrame();
    assert.equal(outputContents(), 'Hello, World!');
  });
});
