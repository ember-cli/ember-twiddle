import Ember from "ember";
import config from '../../../config/environment';

import { moduleForComponent, skip } from 'ember-qunit';
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

    this.makeNewPromise = (event) => {
      return new Ember.RSVP.Promise(resolve => {
        this.set(event, () => {
          resolve();
        });
      });
    };

    // if maximum Number of Files expanded is one less than the number of files,
    // the tree will be initially collapsed
    config.maxNumFilesInitiallyExpanded = 4;

    const waitForRender = this.makeNewPromise('didBecomeReady');
    this.set('waitForRender', waitForRender);
  }
});

skip('it calls openFile when you click on a leaf node', function(assert) {
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

skip('it has 2 initial nodes', function(assert) {
  assert.expect(2);

  this.render(hbs`{{file-tree model=model
                          didBecomeReady=(action didBecomeReady)}}`);

  return this.get('waitForRender').then(() => {
    assert.equal(this.$('.jstree-anchor').length, 2, "There are 2 initial nodes");

    this.$('.jstree-ocl').click();

    assert.equal(this.$('.jstree-anchor').length, 5, "There are 5 nodes once you expand the some folder");
  });
});

skip('it has all initial nodes expanded if the maxNumFilesInitiallyExpanded is set to more than the number of files in the app', function(assert) {
  assert.expect(1);
  config.maxNumFilesInitiallyExpanded = 6;
  this.render(hbs`{{file-tree model=model
                          didBecomeReady=(action didBecomeReady)}}`);

  return this.get('waitForRender').then(() => {
    assert.equal(this.$('.jstree-anchor').length, 9, "All initial nodes are expanded");
  });
});

skip('can expand and collapse all', function(assert) {
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

skip('it updates when you rename a file', function(assert) {
  assert.expect(2);

  const waitForChange = this.makeNewPromise('didChange');

  this.render(hbs`{{file-tree model=model
                          didBecomeReady=(action didBecomeReady)
                          didChange=(action didChange)}}`);

  return this.get('waitForRender').then(() => {
    this.$('.twiddlicon-expand-all').click();

    assert.equal(this.$('.jstree-anchor').eq(0).text().trim(), "some-path.js");

    this.set('model.files.firstObject.filePath', 'some-new-path.js');

    return waitForChange;
  }).then(() => {

    assert.equal(this.$('.jstree-anchor').eq(0).text().trim(), "some-new-path.js", "Tree updated when file renamed");
  });
});
