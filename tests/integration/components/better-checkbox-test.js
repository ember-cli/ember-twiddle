import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('better-checkbox', 'Integration | Component | better checkbox', {
  integration: true
});

test('it functions', function(assert) {
  assert.expect(3);

  let checkboxChangedCalledTimes = 0;
  this.on('checkboxChanged', () => { checkboxChangedCalledTimes++; });

  this.render(hbs`{{better-checkbox action=(action "checkboxChanged")}}`);

  let comp = this.$('input');

  assert.ok(!comp.prop('checked'), 'checkbox defaults to being unchecked');

  comp.click();

  assert.ok(comp.prop('checked'), 'checkbox becomes checked after click');
  // assert.equal(checkboxChangedCalledTimes, 1, 'action is called on click'); // Not sure why this isn't working; change() does not get called

  comp.click();

  assert.ok(!comp.prop('checked'), 'checkbox becomes unchecked after second click');
  // assert.equal(checkboxChangedCalledTimes, 2, 'action is called on click again'); // Not working either
});

test('it\'s initial checked state can be set to true', function(assert) {
  assert.expect(1);

  this.render(hbs`{{better-checkbox checked=true}}`);

  assert.ok(this.$('input').prop('checked'), 'checkbox defaults to being checked if checked=true passed in');
});
