import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | file editor column', function(hooks) {
  setupRenderingTest(hooks);

  test('it calls addColumn when the add column glyph is clicked', async function(assert) {
    assert.expect(1);

    this.set('externalAction', () => {
      assert.ok(true, 'addColumn action was called');
    });

    await render(hbs`
      {{file-editor-column col='2' numColumns=2 addColumn=(action externalAction)}}
    `);

    await click('.glyphicon-plus');
  });

  test('it calls removeColumn when the remove column glyph is clicked', async function(assert) {
    assert.expect(1);

    this.set('externalAction', () => {
      assert.ok(true, 'removeColumn action was called');
    });

    await render(hbs`
      {{file-editor-column col='2' removeColumn=(action externalAction)}}
    `);

    await click('.glyphicon-remove');
  });

  test('it calls showFileTree when the show file tree glyph is clicked', async function(assert) {
    assert.expect(1);

    this.set('externalAction', () => {
      assert.ok(true, 'showFileTree action was called');
    });

    await render(hbs`
      {{file-editor-column col='1' fileTreeShown=false showFileTree=(action externalAction)}}
    `);

    await click('.glyphicon-chevron-right');
  });

  test('it calls contentChanged with true when changing the content via the code editor', async function(assert) {
    assert.expect(1);
    const enterKeyEvent = { keyCode: 3 };

    this.set('externalAction', (isUserChange) => {
      assert.ok(isUserChange, 'contentChanged was called with isUserChange = true');
    });

    this.set('ignoreAction', function() {});

    this.set('file', { content: '' });

    await render(hbs`
      {{file-editor-column col='1' file=file contentChanged=(action externalAction) focusEditor=(action ignoreAction)}}
    `);

    const codeMirrorInstance = $(this.element).find('.CodeMirror')[0].CodeMirror;
    codeMirrorInstance.triggerOnKeyDown(enterKeyEvent);
  });

  test('it calls contentChanged with false when changing the content programatically', async function(assert) {
    assert.expect(1);

    this.set('externalAction', (isUserChange) => {
      assert.notOk(isUserChange, 'contentChanged was called with isUserChange = false');
    });

    this.set('file', { content: '' });

    await render(hbs`
      {{file-editor-column col='1' file=file contentChanged=(action externalAction)}}
    `);

    this.set('file.content', 'new content');
  });
});
