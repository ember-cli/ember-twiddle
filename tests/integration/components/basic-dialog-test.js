import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember$ from 'jquery';

moduleForComponent('basic-dialog', 'Integration | Component | basic dialog', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.closed = false;
  this.on('onClose', () => { this.closed = true; });

  this.render(hbs`
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
