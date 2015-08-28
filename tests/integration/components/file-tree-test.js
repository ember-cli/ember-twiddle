import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-tree', 'Integration | Component | file tree', {
  integration: true,
  beforeEach() {
    this.openFileCalled = false;
    this.hideFileTreeCalled = false;

    this.file1 = Ember.Object.create({
      filePath: "some-path.js"
    });

    this.file2 = Ember.Object.create({
      filePath: "some/path.js"
    });

    this.gist = Ember.Object.create({
      id: '74bae9a34142370ff5a3',
      files: [this.file1, this.file2],
      history: [],
      ownerLogin: 'Gaurav0',
      isNew: false
    });

    this.set('model', this.gist);

    this.on('openFile', () => { this.openFileCalled = true; });
    this.on('hideFileTree', () => { this.hideFileTreeCalled = true; });

    this.render(hbs`{{file-tree model=model
                                openFile=(action "openFile")
                                hideFileTree=(action "hideFileTree")}}`);
  }
});

test('it calls hideFileTree when you hide the panel', function(assert) {
  assert.expect(1);

  this.$('.glyphicon-chevron-left').click();

  assert.ok(this.hideFileTreeCalled, "hideFileTree was called");
});

test('it has 2 initial nodes', function(assert) {
  assert.expect(2);

  assert.equal(this.$('.jstree-anchor').length, 2, "There are 2 initial nodes");

  this.$('.jstree-anchor').eq(0).click();
  this.$('.jstree-anchor').eq(1).click();

  assert.equal(this.$('.jstree-anchor').length, 3, "There are 3 nodes once each is expanded");
});

test('it calls openFile when you click on a leaf node', function(assert) {
  assert.expect(1);

  this.$('.jstree-anchor').eq(0).click();

  assert.ok(this.openFileCalled, "openFile was called");
});

test('can expand and collapse all', function(assert) {
  assert.expect(3);

  assert.equal(this.$('.jstree-anchor').length, 2, "There are 2 initial nodes");

  this.$('.glyphicon-resize-full').click();

  assert.equal(this.$('.jstree-anchor').length, 3, "There are 3 nodes once you expand all");

  this.$('.glyphicon-resize-small').click();

  assert.equal(this.$('.jstree-anchor').length, 2, "There are 2 nodes once you collapse all");
});
