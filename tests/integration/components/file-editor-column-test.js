import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-editor-column', 'Integration | Component | file editor column', {
  integration: true,
  beforeEach() {
    this.addColumnCalled = false;
    this.removeColumnCalled = false;
    this.showFileTreeCalled = false;

    this.set('col', '2');

    this.on('addColumn', () => { this.addColumnCalled = true; });
    this.on('removeColumn', () => { this.removeColumnCalled = true; });
    this.on('showFileTree', () => { this.showFileTreeCalled = true; });

    this.render(hbs`{{file-editor-column col=col
                                         file=null
                                         allFiles=null
                                         keyMap=null
                                         numColumns=2
                                         fileTreeShown=false
                                         contentsChanged="contentsChanged"
                                         addColumn=(action "addColumn")
                                         removeColumn=(action "removeColumn")
                                         showFileTree=(action "showFileTree")
                                         }}`);
  }
});

test('it calls addColumn when the add column glyph is clicked', function(assert) {
  assert.expect(1);

  this.$('.glyphicon-plus').click();

  assert.ok(this.addColumnCalled, 'addColumn was called');
});

test('it calls removeColumn when the remove column glyph is clicked', function(assert) {
  assert.expect(1);

  this.$('.glyphicon-remove').click();

  assert.ok(this.removeColumnCalled, 'removeColumn was called');
});

test('it calls showFileTree when the show file tree glyph is clicked', function(assert) {
  assert.expect(1);

  this.set('col', '1');

  this.$('.glyphicon-chevron-right').click();

  assert.ok(this.showFileTreeCalled, 'showFileTree was called');
});
