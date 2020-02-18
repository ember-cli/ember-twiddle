/* eslint-disable no-console */
import Ember from 'ember';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build messages', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.cacheConsole = console.error;
  });

  hooks.afterEach(function() {
    console.error = this.cacheConsole;
  });

  test('it shows the number of build messages', async function(assert) {
    assert.expect(2);

    this.set('buildErrors', []);
    this.set('isBuilding', false);
    this.set('notify', {
      info() {},
      error() {}
    });

    await render(hbs`{{build-messages buildErrors=buildErrors isBuilding=isBuilding notify=notify}}`);

    assert.equal(this.$('span').text().replace(/\s+/g, " ").trim(), 'Output ( build ok. )', 'shows build ok when no buildErrors');

    this.set('buildErrors', ['error1', 'error2']);

    assert.equal(this.$('span').text().replace(/\s+/g, " ").trim(), 'Output ( 2 build errors )', 'shows number of build errors');
  });

  test('it calls notify.errpr() when clicking on build errors', async function(assert) {
    assert.expect(1);

    let notifyObject = Ember.Object.create({
      called: false,
      info() {},
      error() {
        this.set('called', true);
      }
    });

    console.error = () => {};
    this.set('buildErrors', ['error1', 'error2']);
    this.set('isBuilding', false);
    this.set('notify', notifyObject);

    await render(hbs`{{build-messages buildErrors=buildErrors isBuilding=isBuilding notify=notify}}`);

    this.$('span a').click();

    assert.ok(notifyObject.get('called'), "notify.error() was called");
  });
});
