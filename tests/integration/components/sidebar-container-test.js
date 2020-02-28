import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { Service, RSVP } = Ember;

module('Integration | Component | sidebar container', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    this.owner.register('service:session', Service.extend());
    this.container
      .registry
      .registrations['helper:route-action'] = Ember.Helper.helper(() => {
        return function(arg) {
          return RSVP.resolve(arg);
        };
      });

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{sidebar-container}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#sidebar-container}}
        template block text
      {{/sidebar-container}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
