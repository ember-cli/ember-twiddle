import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('twiddle-panes', 'Integration | Component | twiddle panes', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(3);

  this.render(hbs`{{twiddle-panes}}`);

  assert.equal(this.$('.handle').length, 0, 'Still renders if no columns');

  this.set('numColumns', 4);

  this.render(hbs`
    {{#twiddle-panes numColumns=numColumns}}
      <div class="col-md-4"></div>
      <div class="col-md-4"></div>
      <div class="col-md-4"></div>
      <div class="col-md-4"></div>
    {{/twiddle-panes}}
  `);

  assert.equal(this.$('.handle').length, 3, 'Renders 3 handles if 4 columns');

  this.$('.col-md-4').last().after('<div class="col-md-4"></div>');
  this.set('numColumns', 5);

  assert.equal(this.$('.handle').length, 4, 'Increases handles to 4 if a column is inserted');
});
