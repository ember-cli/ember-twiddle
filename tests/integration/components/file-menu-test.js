import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-menu', 'Integration | Component | file menu', {
  integration: true
});

test('it functions', function(assert) {
  assert.expect(13);

  // Set any properties with this.set('myProperty', 'value');
  let file = Ember.Object.create({
    filePath: "some.path.js"
  });

  let model = Ember.Object.create({
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
                              addFile="addFile"
                              renameFile="renameFile"
                              removeFile="removeFile"
                              saveGist="saveGist"
                              fork="fork"
                              deleteGist="deleteGist"
                              signInViaGithub="signInViaGithub"}}`);

  this.$('.test-template-action').click();

  assert.ok(addFileCalled, 'addFile was called');
  assert.equal(fileType, 'template', 'addFile was called with type parameter');

  this.$('.test-rename-action').click();

  assert.ok(renameFileCalled, 'renameFile was called');
  assert.equal(renamedFile, file, 'renameFile was called with file to rename');

  this.$('.test-remove-action').click();

  assert.ok(removeFileCalled, 'removeFile was called');
  assert.equal(removedFile, file, 'removeFile was called with file to remove');

  this.$('.test-save-action').click();

  assert.ok(saveGistCalled, 'saveGist was called');
  assert.equal(gistToSave, model, 'saveGist was called with gist to save');

  this.$('.test-fork-action').click();

  assert.ok(forkCalled, 'fork was called');
  assert.equal(gistToFork, model, 'fork was called with gist to fork');

  this.$('.test-delete-action').click();

  assert.ok(deleteGistCalled, 'deleteGist was called');
  assert.equal(gistToDelete, model, 'deleteGist was called with gist to delete');

  this.set('session.isAuthenticated', false);
  this.$('.test-sign-in-action').click();

  assert.ok(signInViaGithubCalled, 'signInViaGithub was called');
});
