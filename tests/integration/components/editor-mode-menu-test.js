import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | editor mode menu', function(hooks) {
  setupRenderingTest(hooks);

  test('it calls setKeyMap with the chosen keyMap', async function(assert) {
    assert.expect(2);

    this.actions = {
      setKeyMap(keyMap) {
        assert.ok(true, 'setKeyMap was called');
        assert.equal(keyMap, 'vim', 'chosen keyMap was passed to setKeyMap');
      }
    };

    await render(hbs`{{editor-mode-menu setKeyMap=(action "setKeyMap")}}`);

    this.$('.key-map-option.vim').click();
  });
});
