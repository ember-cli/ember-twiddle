import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import config from '../../../config/environment';

import { module, test } from 'qunit';

import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | file tree', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.file1 = EmberObject.create({
      filePath: "some-path.js"
    });

    this.file2 = EmberObject.create({
      filePath: "some/path.js"
    });

    this.file3 = EmberObject.create({
      filePath: "some/long/path.js"
    });

    this.file4 = EmberObject.create({
      filePath: "some/path/to/file.js"
    });

    this.file5 = EmberObject.create({
      filePath: "some/path/to/file2.js"
    });

    this.gist = EmberObject.create({
      id: '74bae9a34142370ff5a3',
      files: [this.file1, this.file2, this.file3, this.file4, this.file5],
      history: [],
      ownerLogin: 'Gaurav0',
      isNew: false
    });

    this.set('model', this.gist);

    this.makeNewPromise = (event) => {
      return new Promise(resolve => {
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
  });

  test('it calls openFile when you click on a leaf node', async function(assert) {
    assert.expect(1);

    this.set('externalAction', () => {
      assert.ok(true, 'openFile was called');
    });

    await render(hbs`{{file-tree model=model
                              openFile=(action externalAction)
                              didBecomeReady=(action didBecomeReady)}}`);

    return this.get('waitForRender').then(() => {
      this.$('.jstree-anchor').eq(0).click();
    });
  });

  test('it has 2 initial nodes', async function(assert) {
    assert.expect(2);

    await render(hbs`{{file-tree model=model
                            didBecomeReady=(action didBecomeReady)}}`);

    return this.get('waitForRender').then(() => {
      assert.equal(this.$('.jstree-anchor').length, 2, "There are 2 initial nodes");

      this.$('.jstree-ocl').click();

      assert.equal(this.$('.jstree-anchor').length, 5, "There are 5 nodes once you expand the some folder");
    });
  });

  test('it has all initial nodes expanded if the maxNumFilesInitiallyExpanded is set to more than the number of files in the app', async function(assert) {
    assert.expect(1);
    config.maxNumFilesInitiallyExpanded = 6;
    await render(hbs`{{file-tree model=model
                            didBecomeReady=(action didBecomeReady)}}`);

    return this.get('waitForRender').then(() => {
      assert.equal(this.$('.jstree-anchor').length, 9, "All initial nodes are expanded");
    });
  });

  test('can expand and collapse all', async function(assert) {
    assert.expect(3);

    this.set('externalOpenFile', () => {
      assert.ok(true, 'openFile was called');
    });

    this.set('externalHideFileTree', () => {
      assert.ok(true, 'hideFileTree was called');
    });

    await render(hbs`{{file-tree model=model
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

  test('it updates when you rename a file', async function(assert) {
    assert.expect(2);

    const waitForChange = this.makeNewPromise('didChange');

    await render(hbs`{{file-tree model=model
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
});
