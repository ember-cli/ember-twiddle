import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';

module('Acceptance | gist-revision', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;
  });

  hooks.afterEach(function() {
    window.confirm = this.cacheConfirm;
  });

  test('Able to load a previous revision of a gist', function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Hello, World!"
      }
    ];

    runRevision(files);

    assert.equal(outputContents(), 'Hello, World!', 'Previous version of a gist is displayed');
  });

  test('Able to copy a revision into new gist', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this.application, {
      currentUser: { login: "Gaurav0" },
      "github-oauth2": {}
    });

    runRevision([
      {
        filename: 'application.template.hbs',
        content: 'hello world!'
      }
    ]);

    assert.dom('.test-unsaved-indicator').doesNotExist("No unsaved indicator shown");

    await fillIn('.title input', "my twiddle");
    assert.dom('.title input').hasValue("my twiddle");

    await click("#live-reload");
    await click('.test-copy-action');
    waitForUnloadedIFrame();
    waitForLoadedIFrame();

    assert.dom('.title input').hasValue("New Twiddle", "Description is reset");
    assert.dom('.test-unsaved-indicator').doesNotExist("Unsaved indicator does not appear when gist is copied");
    assert.dom('.test-copy-action').doesNotExist("Menu item to copy gist is not shown anymore");
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

    runGist(files);

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
    waitForLoadedIFrame();
    assert.equal(outputContents(), 'Hello, ...');

    await click(".test-show-current-version");
    waitForUnloadedIFrame();
    waitForLoadedIFrame();
    assert.equal(outputContents(), 'Hello, World!');
  });
});
