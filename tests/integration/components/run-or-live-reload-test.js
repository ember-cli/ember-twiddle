import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('run-or-live-reload', 'Integration | Component | run or live reload', {
  integration: true
});

test('it functions', function(assert) {
  assert.expect(6);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  let liveReloadChangedCalledTimes = 0;
  let runNowCalled = false;

  this.on('liveReloadChanged', () => { liveReloadChangedCalledTimes++; });
  this.on('runNow', () => { runNowCalled = true; });

  this.render(hbs`{{run-or-live-reload liveReloadChanged=(action "liveReloadChanged") runNow=(action "runNow")}}`);

  let liveReloadCheckbox = this.$("#live-reload");

  assert.ok(liveReloadCheckbox.prop('checked'), 'isLiveReload defaults to true');

  liveReloadCheckbox.click();

  assert.ok(!liveReloadCheckbox.prop('checked'), 'isLiveReload changes to false on click of live reload checkbox');
  assert.equal(liveReloadChangedCalledTimes, 1, 'liveReloadChanged was called on click of live reload checkbox');

  this.$('.run-now').click();

  assert.ok(runNowCalled, 'runNow was called on click of run now button');

  liveReloadCheckbox.click();

  assert.ok(liveReloadCheckbox.prop('checked'), 'isLiveReload changes back to true on click of live reload checkbox');
  assert.equal(liveReloadChangedCalledTimes, 2, 'liveReloadChanged was called again on click of live reload checkbox');
});
