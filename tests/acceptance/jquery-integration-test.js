import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

module('Acceptance | jquery-integration', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can turn jquery integration off', async function(assert) {

    let files = [
      {
        filename: "templates.application.hbs",
        content: `<h1>Welcome to {{this.appName}}</h1>`
      },
      {
        filename: "controllers.application.js",
        content: `import Controller from '@ember/controller';

                  export default class ApplicationController extends Controller {
                    appName = 'Ember Twiddle';
                  }`
      },
      {
        filename: "twiddle.json",
        content: `{
          "version": "0.17.0",
          "EmberENV": {
            "FEATURES": {},
            "_TEMPLATE_ONLY_GLIMMER_COMPONENTS": false,
            "_APPLICATION_TEMPLATE_WRAPPER": false,
            "_JQUERY_INTEGRATION": false
          },
          "options": {
            "use_pods": false,
            "enable-testing": false
          },
          "dependencies": {
            "ember": "3.14.3",
            "ember-template-compiler": "3.14.3",
            "ember-testing": "3.14.3"
          },
          "addons": {
            "ember-data": "3.14.1"
          }
        }`
      }
    ];

    await runGist(files);

    assert.equal(outputContents(), 'Welcome to Ember Twiddle');
  });
});
