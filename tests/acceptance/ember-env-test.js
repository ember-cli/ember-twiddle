import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

module('Acceptance | EmberENV', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Able to specify EmberENV in twiddle.json', async function(assert) {

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
        content: "<div class='ember-env-value'>{{value}}</div>"
      }
    ];

    await runGist(files);

    assert.equal(outputContents('.ember-env-value'), 'it works', 'EmberENV is used from twiddle.json');
  });
});
