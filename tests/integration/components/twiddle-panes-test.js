import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | twiddle panes', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(3);

    await render(hbs`{{twiddle-panes}}`);

    assert.dom('.handle').doesNotExist('Still renders if no columns');

    this.set('numColumns', 4);

    await render(hbs`
      {{#twiddle-panes numColumns=numColumns}}
        <div class="twiddle-pane"></div>
        <div class="twiddle-pane"></div>
        <div class="twiddle-pane"></div>
        <div class="twiddle-pane"></div>
      {{/twiddle-panes}}
    `);

    assert.dom('.handle').exists({ count: 3 }, 'Renders 3 handles if 4 columns');

    this.$('.twiddle-pane').last().after('<div class="twiddle-pane"></div>');
    this.set('numColumns', 5);

    assert.dom('.handle').exists({ count: 4 }, 'Increases handles to 4 if a column is inserted');
  });
});
