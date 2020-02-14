import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';


module('Integration | Component | run or live reload', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it functions', async function(assert) {
    assert.expect(6);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    let liveReloadChangedCalledTimes = 0;
    let runNowCalled = false;

    this.actions.liveReloadChanged = () => { liveReloadChangedCalledTimes++; };
    this.actions.runNow = () => { runNowCalled = true; };

    await render(hbs`{{run-or-live-reload liveReloadChanged=(action "liveReloadChanged") runNow=(action "runNow")}}`);

    let liveReloadCheckbox = this.$("#live-reload");

    assert.ok(liveReloadCheckbox.prop('checked'), 'isLiveReload defaults to true');

    liveReloadCheckbox.click();

    assert.ok(!liveReloadCheckbox.prop('checked'), 'isLiveReload changes to false on click of live reload checkbox');
    assert.equal(liveReloadChangedCalledTimes, 1, 'liveReloadChanged was called on click of live reload checkbox');

    await click('.run-now');

    assert.ok(runNowCalled, 'runNow was called on click of run now button');

    liveReloadCheckbox.click();

    assert.ok(liveReloadCheckbox.prop('checked'), 'isLiveReload changes back to true on click of live reload checkbox');
    assert.equal(liveReloadChangedCalledTimes, 2, 'liveReloadChanged was called again on click of live reload checkbox');
  });
});
