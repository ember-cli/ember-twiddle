import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { Service, RSVP } = Ember;

moduleForComponent('sidebar-container', 'Integration | Component | sidebar container', {
  integration: true
});

test('it renders', function(assert) {

  this.register('service:session', Service.extend());
  this.container
    .registry
    .registrations['helper:route-action'] = Ember.Helper.helper(() => {
      return function(arg) {
        return RSVP.resolve(arg);
      };
    });

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sidebar-container}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sidebar-container}}
      template block text
    {{/sidebar-container}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
