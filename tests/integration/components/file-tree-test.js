import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-tree', 'Integration | Component | file tree', {
  integration: true,
  beforeEach() {
    this.file1 = Ember.Object.create({
      filePath: "some-path.js"
    });

    this.file2 = Ember.Object.create({
      filePath: "some/path.js"
    });

    this.file3 = Ember.Object.create({
      filePath: "some/long/path.js"
    });

    this.file4 = Ember.Object.create({
      filePath: "some/path/to/file.js"
    });

    this.file5 = Ember.Object.create({
      filePath: "some/path/to/file2.js"
    });

    this.gist = Ember.Object.create({
      id: '74bae9a34142370ff5a3',
      files: [this.file1, this.file2, this.file3, this.file4, this.file5],
      history: [],
      ownerLogin: 'Gaurav0',
      isNew: false
    });

    this.set('model', this.gist);

    this.makeNewPromise = () => {
      return new Ember.RSVP.Promise(resolve => {
        this.set('didBecomeReady', () => {
          resolve();
        });
      });
    };

    const waitForRender = this.makeNewPromise();
    this.set('waitForRender', waitForRender);
  }
});

test('it calls openFile when you click on a leaf node', function(assert) {
  assert.expect(1);

  this.set('externalAction', () => {
    assert.ok(true, 'openFile was called');
  });

  this.render(hbs`{{file-tree model=model
                            openFile=(action externalAction)
                            didBecomeReady=(action didBecomeReady)}}`);

  return this.get('waitForRender').then(() => {
    this.$('.jstree-anchor').eq(0).click();
  });
});

test('it has 2 initial nodes', function(assert) {
  assert.expect(2);

  this.render(hbs`{{file-tree model=model
                          didBecomeReady=(action didBecomeReady)}}`);

  return this.get('waitForRender').then(() => {
    assert.equal(this.$('.jstree-anchor').length, 2, "There are 2 initial nodes");

    this.$('.jstree-ocl').click();

    assert.equal(this.$('.jstree-anchor').length, 5, "There are 5 nodes once you expand the some folder");
  });
});

test('can expand and collapse all', function(assert) {
  assert.expect(3);

  this.set('externalOpenFile', () => {
    assert.ok(true, 'openFile was called');
  });

  this.set('externalHideFileTree', () => {
    assert.ok(true, 'hideFileTree was called');
  });

  this.render(hbs`{{file-tree model=model
                          openFile=(action externalOpenFile)
                          hideFileTree=(action externalHideFileTree)
                          didBecomeReady=(action didBecomeReady)}}`);

  return this.get('waitForRender').then(() => {
    assert.equal(this.$('.jstree-anchor').length, 2, "There are 2 initial nodes");

    this.$('.twiddlicon-expand-all').click();

    assert.equal(this.$('.jstree-anchor').length, 9, "There are 9 nodes once you expand all");

    this.$('.twiddlicon-collapse-all').click();

    assert.equal(this.$('.jstree-anchor').length, 2, "There are 2 nodes once you collapse all");
  });
});

test('it updates when you rename a file', function(assert) {
  assert.expect(2);

  this.render(hbs`{{file-tree model=model
                          didBecomeReady=(action didBecomeReady)}}`);

  return this.get('waitForRender').then(() => {
    this.$('.twiddlicon-expand-all').click();

    assert.equal(this.$('.jstree-anchor').eq(0).text().trim(), "some-path.js");

    this.set('model.files.firstObject.filePath', 'some-new-path.js');

    return this.makeNewPromise();
  }).then(() => {
    assert.equal(this.$('.jstree-anchor').eq(0).text().trim(), "some-new-path.js", "Tree updated when file renamed");
  });
});
