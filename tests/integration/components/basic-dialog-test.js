import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Ember$ from 'jquery';

module('Integration | Component | basic dialog', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.closed = false;
    this.actions.onClose = () => { this.closed = true; };

    await render(hbs`
      {{#basic-dialog onClose=(action 'onClose') as |dialog|}}
        {{#dialog.content}}
          some template text
        {{/dialog.content}}
      {{/basic-dialog}}
    `);

    var root = Ember$('#ember-testing');

    assert.equal(root.find('.md-dialog-content').text().trim(), 'some template text');

    root.find('[data-test-close-button]').click();

    assert.ok(this.closed, 'onClose called');
  });
});
