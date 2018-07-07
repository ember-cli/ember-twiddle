import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | EmberENV');

test('Able to specify EmberENV in twiddle.json', function(assert) {

  const files = [
    {
      filename: "twiddle.json",
      content: `{
                  "dependencies": {},
                  "EmberENV": {
                    "value": "it works"
                  }
                }`
    },
    {
      filename: "application.controller.js",
      content: `import Ember from 'ember';
                export default Ember.Controller.extend({
                  value: Ember.computed(function() {
                    return EmberENV.value;
                  })
                });`
    },
    {
      filename: "application.template.hbs",
      content: `<div class="ember-env-value">{{value}}</div>`
    }
  ];

  runGist(files);

  andThen(function() {
    assert.equal(outputContents('.ember-env-value'), 'it works', 'EmberENV is used from twiddle.json');
  });
});
