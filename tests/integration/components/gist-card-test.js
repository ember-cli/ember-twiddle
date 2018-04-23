import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { Service, RSVP } = Ember;

moduleForComponent('gist-card', 'Integration | Component | gist card', {
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

  this.render(hbs`{{gist-card}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gist-card}}
      template block text
    {{/gist-card}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
