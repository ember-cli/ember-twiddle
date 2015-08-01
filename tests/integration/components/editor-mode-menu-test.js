import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('editor-mode-menu', 'Integration | Component | editor mode menu', {
  integration: true
});

test('it calls setKeyMap with the chosen keyMap', function(assert) {
  assert.expect(2);

  this.actions = {
    setKeyMap(keyMap) {
      assert.ok(true, 'setKeyMap was called');
      assert.equal(keyMap, 'vim', 'chosen keyMap was passed to setKeyMap');
    }
  };

  this.render(hbs`{{editor-mode-menu setKeyMap=(action "setKeyMap")}}`);

  this.$('.key-map-option.vim').click();
});
