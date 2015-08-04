import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

let file, model;

let addFileCalled = false;
let renameFileCalled = false;
let removeFileCalled = false;
let saveGistCalled = false;
let forkCalled = false;
let deleteGistCalled = false;
let signInViaGithubCalled = false;

let fileType = null;
let renamedFile = null;
let removedFile = null;
let gistToSave = null;
let gistToFork = null;
let gistToDelete = null;

moduleForComponent('file-menu', 'Integration | Component | file menu', {
  integration: true,
  beforeEach() {

    // Set any properties with this.set('myProperty', 'value');
    file = Ember.Object.create({
      filePath: "some.path.js"
    });

    model = Ember.Object.create({
      id: '74bae9a34142370ff5a3',
      files: [file],
      history: [],
      isNew: false
    });

    this.set('model', model);

    this.set('session', Ember.Object.create({
      isAuthenticated: true
    }));

    this.set('activeEditorCol', 1);

    this.set('activeFile', file);

    // Handle any actions with this.on('myAction', function(val) { ... });
    this.on('addFile', (type) => { addFileCalled = true; fileType = type; });
    this.on('renameFile', (file) => { renameFileCalled = true; renamedFile = file; });
    this.on('removeFile', (file) => { removeFileCalled = true; removedFile = file; });
    this.on('saveGist', (gist) => { saveGistCalled = true; gistToSave = gist; });
    this.on('fork', (gist) => { forkCalled = true; gistToFork = gist; });
    this.on('deleteGist', (gist) => { deleteGistCalled = true; gistToDelete = gist; });
    this.on('signInViaGithub', () => { signInViaGithubCalled = true; });

    this.render(hbs`{{file-menu model=model
                              session=session
                              activeEditorCol=activeEditorCol
                              activeFile=activeFile
                              addFile=(action "addFile")
                              renameFile=(action "renameFile")
                              removeFile=(action "removeFile")
                              saveGist="saveGist"
                              fork=(action "fork")
                              deleteGist=(action "deleteGist")
                              signInViaGithub="signInViaGithub"}}`);
  }
});

test('it calls addFile on clicking an add file menu item', function(assert) {
  assert.expect(2);

  this.$('.test-template-action').click();

  assert.ok(addFileCalled, 'addFile was called');
  assert.equal(fileType, 'template', 'addFile was called with type parameter');
});

test("it calls renameFile on clicking 'Rename'", function(assert) {
  assert.expect(2);

  this.$('.test-rename-action').click();

  assert.ok(renameFileCalled, 'renameFile was called');
  assert.equal(renamedFile, file, 'renameFile was called with file to rename');
});

test("it calls removeFile on clicking 'Remove'", function(assert) {
  assert.expect(2);

  this.$('.test-remove-action').click();

  assert.ok(removeFileCalled, 'removeFile was called');
  assert.equal(removedFile, file, 'removeFile was called with file to remove');
});

test("it calls saveGist on clicking 'Save to Github'", function(assert) {
  assert.expect(2);

  this.$('.test-save-action').click();

  assert.ok(saveGistCalled, 'saveGist was called');
  assert.equal(gistToSave, model, 'saveGist was called with gist to save');
});

test("it calls fork on clicking 'Fork Twiddle'", function(assert) {
  assert.expect(2);

  this.$('.test-fork-action').click();

  assert.ok(forkCalled, 'fork was called');
  assert.equal(gistToFork, model, 'fork was called with gist to fork');
});

test("it calls deleteGist on clicking 'Delete Twiddle'", function(assert) {
  assert.expect(2);

  this.$('.test-delete-action').click();

  assert.ok(deleteGistCalled, 'deleteGist was called');
  assert.equal(gistToDelete, model, 'deleteGist was called with gist to delete');
});

test("it calls signInViaGithub when clicking on 'Sign In To Github To Save'", function(assert) {
  assert.expect(1);

  this.set('session.isAuthenticated', false);
  this.$('.test-sign-in-action').click();

  assert.ok(signInViaGithubCalled, 'signInViaGithub was called');
});
