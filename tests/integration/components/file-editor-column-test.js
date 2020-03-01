import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | file editor column', function(hooks) {
  setupRenderingTest(hooks);

  test('it calls addColumn when the add column glyph is clicked', async function(assert) {
    assert.expect(1);
    this.setProperties({
      addColumn: () => {
        assert.ok(true, 'addColumn action was called');
      },
      noop: () => {}
    });

    await render(hbs`
      {{file-editor-column col='2' numColumns=2
        addColumn=this.addColumn
        focusEditor=this.noop
        selectFile=this.noop
        contentChanged=this.noop
        removeColumn=this.noop
        showFileTree=this.noop
        hideFileTree=this.noop
      }}
    `);

    await click('.glyphicon-plus');
  });

  test('it calls removeColumn when the remove column glyph is clicked', async function(assert) {
    assert.expect(1);

    this.setProperties({
      removeColumn: () => {
        assert.ok(true, 'removeColumn action was called');
      },
      noop: () => {}
    });

    await render(hbs`
      {{file-editor-column col='2'
        removeColumn=this.removeColumn
        addColumn=this.noop
        focusEditor=this.noop
        selectFile=this.noop
        contentChanged=this.noop
        showFileTree=this.noop
        hideFileTree=this.noop
      }}
    `);

    await click('.glyphicon-remove');
  });

  test('it calls showFileTree when the show file tree glyph is clicked', async function(assert) {
    assert.expect(1);

    this.setProperties({
      showFileTree: () => {
        assert.ok(true, 'showFileTree action was called');
      },
      noop: () => {}
    });

    await render(hbs`
      {{file-editor-column col='1' fileTreeShown=false
        showFileTree=this.showFileTree
        removeColumn=this.noop
        addColumn=this.noop
        focusEditor=this.noop
        selectFile=this.noop
        contentChanged=this.noop
        hideFileTree=this.noop
      }}
    `);

    await click('.glyphicon-chevron-right');
  });

  test('it calls contentChanged with true when changing the content via the code editor', async function(assert) {
    assert.expect(1);

    this.setProperties({
      file: { content: '' },
      contentChanged: (isUserChange) => {
        assert.ok(isUserChange, 'contentChanged was called with isUserChange = true');
      },
      noop: () => {}
    });

    await render(hbs`
      {{file-editor-column col='1' file=file
        contentChanged=this.contentChanged
        showFileTree=this.noop
        removeColumn=this.noop
        addColumn=this.noop
        focusEditor=this.noop
        selectFile=this.noop
        hideFileTree=this.noop
      }}
    `);

    let textboxNode = '.CodeMirror textarea';
    await fillIn(textboxNode, 'a');
  });

  test('it calls contentChanged with false when changing the content programatically', async function(assert) {
    assert.expect(1);

    this.setProperties({
      file: { content: '' },
      contentChanged: (isUserChange) => {
        assert.notOk(isUserChange, 'contentChanged was called with isUserChange = false');
      },
      noop: () => {}
    });

    await render(hbs`
      {{file-editor-column col='1' file=file
        contentChanged=this.contentChanged
        showFileTree=this.noop
        removeColumn=this.noop
        addColumn=this.noop
        focusEditor=this.noop
        selectFile=this.noop
        hideFileTree=this.noop
      }}
    `);

    this.set('file.content', 'new content');
  });
});
