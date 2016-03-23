import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-menu', 'Integration | Component | file menu', {
  integration: true,
  beforeEach() {

    this.addFileCalled = false;
    this.renameFileCalled = false;
    this.removeFileCalled = false;
    this.saveGistCalled = false;
    this.forkCalled = false;
    this.copyCalled = false;
    this.deleteGistCalled = false;
    this.signInViaGithubCalled = false;

    this.fileType = null;
    this.renamedFile = null;
    this.removedFile = null;
    this.gistToSave = null;
    this.gistToFork = null;
    this.gistToDelete = null;

    this.file = Ember.Object.create({
      filePath: "some.path.js"
    });

    this.gist = Ember.Object.create({
      id: '74bae9a34142370ff5a3',
      files: [this.file],
      history: [],
      ownerLogin: 'Gaurav0',
      isNew: false
    });

    // Set any properties with this.set('myProperty', 'value');
    this.set('model', this.gist);

    this.set('session', Ember.Object.create({
      isAuthenticated: true,
      currentUser: {
        login: 'octocat'
      }
    }));

    this.set('activeEditorCol', 1);

    this.set('activeFile', this.file);

    // Handle any actions with this.on('myAction', function(val) { ... });
    this.on('addFile', (type) => { this.addFileCalled = true; this.fileType = type; });
    this.on('renameFile', (file) => { this.renameFileCalled = true; this.renamedFile = file; });
    this.on('removeFile', (file) => { this.removeFileCalled = true; this.removedFile = file; });
    this.on('saveGist', (gist) => { this.saveGistCalled = true; this.gistToSave = gist; });
    this.on('fork', (gist) => { this.forkCalled = true; this.gistToFork = gist; });
    this.on('copy', () => { this.copyCalled = true; });
    this.on('deleteGist', (gist) => { this.deleteGistCalled = true; this.gistToDelete = gist; });
    this.on('signInViaGithub', () => { this.signInViaGithubCalled = true; });

    this.render(hbs`{{file-menu model=model
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
                              signInViaGithub=(action "signInViaGithub")}}`);
  }
});

test('it calls addFile on clicking an add file menu item', function(assert) {
  assert.expect(2);

  this.$('.test-template-action').click();

  assert.ok(this.addFileCalled, 'addFile was called');
  assert.equal(this.fileType, 'template', 'addFile was called with type parameter');
});

test("it calls renameFile on clicking 'Rename'", function(assert) {
  assert.expect(2);

  this.$('.test-rename-action').click();

  assert.ok(this.renameFileCalled, 'renameFile was called');
  assert.equal(this.renamedFile, this.file, 'renameFile was called with file to rename');
});

test("it calls removeFile on clicking 'Remove'", function(assert) {
  assert.expect(2);

  this.$('.test-remove-action').click();

  assert.ok(this.removeFileCalled, 'removeFile was called');
  assert.equal(this.removedFile, this.file, 'removeFile was called with file to remove');
});

test("it calls saveGist on clicking 'Save to Github'", function(assert) {
  assert.expect(2);

  this.$('.test-save-action').click();

  assert.ok(this.saveGistCalled, 'saveGist was called');
  assert.equal(this.gistToSave, this.gist, 'saveGist was called with gist to save');
});

test("it calls fork on clicking 'Fork Twiddle'", function(assert) {
  assert.expect(2);

  this.$('.test-fork-action').click();

  assert.ok(this.forkCalled, 'fork was called');
  assert.equal(this.gistToFork, this.gist, 'fork was called with gist to fork');
});

test("it calls copy on clicking 'Copy Twiddle'", function(assert) {
  assert.expect(1);

  // logged in user is the same as the owner of the gist
  this.set('session.currentUser.login', 'Gaurav0');
  this.$('.test-copy-action').click();

  assert.ok(this.copyCalled, 'copy was called');
});

test("it calls deleteGist on clicking 'Delete Twiddle'", function(assert) {
  assert.expect(2);

  this.$('.test-delete-action').click();

  assert.ok(this.deleteGistCalled, 'deleteGist was called');
  assert.equal(this.gistToDelete, this.gist, 'deleteGist was called with gist to delete');
});

test("it calls signInViaGithub when clicking on 'Sign In To Github To Save'", function(assert) {
  assert.expect(1);

  this.set('session.isAuthenticated', false);
  this.$('.test-sign-in-action').click();

  assert.ok(this.signInViaGithubCalled, 'signInViaGithub was called');
});

test("it only renders 'New Twiddle' menu item, when no model is specified", function(assert) {
  this.render(hbs`{{file-menu}}`);

  assert.equal(this.$('.dropdown-menu li').length, 1, "only one menu item is rendered");
  assert.equal(this.$('.dropdown-menu li').text().trim(), "New Twiddle");
});
