import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { Service, RSVP } = Ember;

moduleForComponent('user-profile', 'Integration | Component | user profile', {
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

  this.render(hbs`{{user-profile}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#user-profile}}
      template block text
    {{/user-profile}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
