import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | file menu', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(async function() {

    this.addFileCalled = false;
    this.renameFileCalled = false;
    this.removeFileCalled = false;
    this.saveGistCalled = false;
    this.forkCalled = false;
    this.copyCalled = false;
    this.deleteGistCalled = false;
    this.signInViaGithubCalled = false;
    this.downloadProjectCalled = false;

    this.fileType = null;
    this.renamedFile = null;
    this.removedFile = null;
    this.gistToSave = null;
    this.gistToFork = null;
    this.gistToDelete = null;

    this.file = EmberObject.create({
      filePath: "some.path.js"
    });

    this.gist = EmberObject.create({
      id: '74bae9a34142370ff5a3',
      files: [this.file],
      history: [],
      ownerLogin: 'Gaurav0',
      isNew: false
    });

    // Set any properties with this.set('myProperty', 'value');
    this.set('model', this.gist);

    this.set('session', EmberObject.create({
      isAuthenticated: true,
      currentUser: {
        login: 'octocat'
      }
    }));

    this.set('activeEditorCol', 1);

    this.set('activeFile', this.file);

    // Handle any actions with this.on('myAction', function(val) { ... });
    this.actions.addFile = (type) => { this.addFileCalled = true; this.fileType = type; };
    this.actions.renameFile = (file) => { this.renameFileCalled = true; this.renamedFile = file; };
    this.actions.removeFile = (file) => { this.removeFileCalled = true; this.removedFile = file; };
    this.actions.saveGist = (gist) => { this.saveGistCalled = true; this.gistToSave = gist; };
    this.actions.fork = (gist) => { this.forkCalled = true; this.gistToFork = gist; };
    this.actions.copy = () => { this.copyCalled = true; };
    this.actions.deleteGist = (gist) => { this.deleteGistCalled = true; this.gistToDelete = gist; };
    this.actions.signInViaGithub = () => { this.signInViaGithubCalled = true; };
    this.actions.downloadProject = () => { this.downloadProjectCalled = true; };

    await render(hbs`{{file-menu model=model
                              session=session
                              activeEditorCol=activeEditorCol
                              activeFile=activeFile
                              addFile=(action "addFile")
                              renameFile=(action "renameFile")
                              removeFile=(action "removeFile")
                              saveGist=(action "saveGist")
                              fork=(action "fork")
                              copy=(action "copy")
                              deleteGist=(action "deleteGist")
                              signInViaGithub=(action "signInViaGithub")
                              downloadProject=(action "downloadProject")}}`);
  });

  test('it calls addFile on clicking an add file menu item', async function(assert) {
    assert.expect(2);

    await click('.test-template-action');

    assert.ok(this.addFileCalled, 'addFile was called');
    assert.equal(this.fileType, 'template', 'addFile was called with type parameter');
  });

  test("it calls renameFile on clicking 'Rename'", async function(assert) {
    assert.expect(2);

    await click('.test-rename-action');

    assert.ok(this.renameFileCalled, 'renameFile was called');
    assert.equal(this.renamedFile, this.file, 'renameFile was called with file to rename');
  });

  test("it calls renameFile on clicking 'Move'", async function(assert) {
    assert.expect(2);

    await click('.test-move-action');

    assert.ok(this.renameFileCalled, 'renameFile was called');
    assert.equal(this.renamedFile, this.file, 'renameFile was called with file to rename');
  });

  test("it calls removeFile on clicking 'Remove'", async function(assert) {
    assert.expect(2);

    await click('.test-remove-action');

    assert.ok(this.removeFileCalled, 'removeFile was called');
    assert.equal(this.removedFile, this.file, 'removeFile was called with file to remove');
  });

  test("it calls saveGist on clicking 'Save to Github'", async function(assert) {
    assert.expect(2);

    await click('.test-save-action');

    assert.ok(this.saveGistCalled, 'saveGist was called');
    assert.equal(this.gistToSave, this.gist, 'saveGist was called with gist to save');
  });

  test("it calls fork on clicking 'Fork Twiddle'", async function(assert) {
    assert.expect(2);

    await click('.test-fork-action');

    assert.ok(this.forkCalled, 'fork was called');
    assert.equal(this.gistToFork, this.gist, 'fork was called with gist to fork');
  });

  test("it calls copy on clicking 'Copy Twiddle'", async function(assert) {
    assert.expect(1);

    // logged in user is the same as the owner of the gist
    this.set('session.currentUser.login', 'Gaurav0');
    await click('.test-copy-action');

    assert.ok(this.copyCalled, 'copy was called');
  });

  test("it calls deleteGist on clicking 'Delete Twiddle'", async function(assert) {
    assert.expect(2);

    await click('.test-delete-action');

    assert.ok(this.deleteGistCalled, 'deleteGist was called');
    assert.equal(this.gistToDelete, this.gist, 'deleteGist was called with gist to delete');
  });

  test("it calls signInViaGithub when clicking on 'Sign In To Github To Save'", async function(assert) {
    assert.expect(1);

    this.set('session.isAuthenticated', false);
    await click('.test-sign-in-action');

    assert.ok(this.signInViaGithubCalled, 'signInViaGithub was called');
  });

  test("it calls downloadProject when clicking on 'Download Project'", async function(assert) {
    assert.expect(1);

    await click('.test-download-project-action');

    assert.ok(this.downloadProjectCalled, 'downloadProject was called');
  });

  test("it only renders 'New Twiddle' menu item, when no model is specified", async function(assert) {
    await render(hbs`{{file-menu}}`);

    assert.dom('.dropdown-menu li').exists({ count: 1 }, "only one menu item is rendered");
    assert.dom('.dropdown-menu li').hasText('New Twiddle');
  });
});
