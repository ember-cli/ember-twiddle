import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-editor-column', 'Integration | Component | file editor column', {
  integration: true
});

test('it calls addColumn when the add column glyph is clicked', function(assert) {
  assert.expect(1);

  this.set('externalAction', () => {
    assert.ok(true, 'addColumn action was called');
  });

  this.render(hbs`
    {{file-editor-column col='2' numColumns=2 addColumn=(action externalAction)}}
  `);

  this.$('.glyphicon-plus').click();
});

test('it calls removeColumn when the remove column glyph is clicked', function(assert) {
  assert.expect(1);

  this.set('externalAction', () => {
    assert.ok(true, 'removeColumn action was called');
  });

  this.render(hbs`
    {{file-editor-column col='2' removeColumn=(action externalAction)}}
  `);

  this.$('.glyphicon-remove').click();
});

test('it calls showFileTree when the show file tree glyph is clicked', function(assert) {
  assert.expect(1);

  this.set('externalAction', () => {
    assert.ok(true, 'showFileTree action was called');
  });

  this.render(hbs`
    {{file-editor-column col='1' fileTreeShown=false showFileTree=(action externalAction)}}
  `);

  this.$('.glyphicon-chevron-right').click();
});

test('it calls contentChanged with true when changing the content via the code editor', function(assert) {
  assert.expect(1);
  const enterKeyEvent = { keyCode: 3 };

  this.set('externalAction', (isUserChange) => {
    assert.ok(isUserChange, 'contentChanged was called with isUserChange = true');
  });

  this.set('ignoreAction', Ember.K);

  this.set('file', { content: '' });

  this.render(hbs`
    {{file-editor-column col='1' file=file contentChanged=(action externalAction) focusEditor=(action ignoreAction)}}
  `);

  const codeMirrorInstance = this.$('.CodeMirror')[0].CodeMirror;
  codeMirrorInstance.triggerOnKeyDown(enterKeyEvent);
});

test('it calls contentChanged with false when changing the content programatically', function(assert) {
  assert.expect(1);

  this.set('externalAction', (isUserChange) => {
    assert.notOk(isUserChange, 'contentChanged was called with isUserChange = false');
  });

  this.set('file', { content: '' });

  this.render(hbs`
    {{file-editor-column col='1' file=file contentChanged=(action externalAction)}}
  `);

  this.set('file.content', 'new content');
});
