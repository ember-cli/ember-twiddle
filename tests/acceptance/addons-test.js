import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

module('Acceptance | addons', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cachePrompt = window.prompt;
    window.prompt = (text, defaultResponse) => defaultResponse;
  });

  hooks.afterEach(function() {
    window.prompt = this.cachePrompt;
  });

  test('Addons work', async function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: `{{#if (gt appName.length 3)}}
                    Welcome to {{appName}}
                  {{/if}}`
      },
      {
        filename: "application.controller.js",
        content: `import Ember from "ember";
                  export default Ember.Controller.extend({
                    appName: 'Ember Twiddle'
                  });`
      },
      {
        filename: "twiddle.json",
        content: `{
                    "version": "0.12.0",
                    "EmberENV": {
                      "FEATURES": {}
                    },
                    "options": {
                      "use_pods": true,
                      "enable-testing": false
                    },
                    "dependencies": {
                      "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",
                      "ember": "2.11.2",
                      "ember-template-compiler": "2.11.2",
                      "ember-testing": "2.11.2"
                    },
                    "addons": {
                      "ember-truth-helpers": "1.2.0"
                    }
                  }`
      }
    ];

    await runGist(files);

    assert.equal(outputContents(), 'Welcome to Ember Twiddle');
  });

  test('Ember Data works as an addon', async function (assert) {
    const files = [
      {
        filename: "templates.application.hbs",
        content: `Welcome to {{model.appName}}`
      },
      {
        filename: "routes.application.js",
        content: `import Ember from "ember";
                  export default Ember.Route.extend({
                    model() {
                      return this.get('store').createRecord('app', {
                        appName: 'Ember Twiddle'
                      });
                    }
                  });`
      },
      {
        filename: "models.app.js",
        content: `import Ember from "ember";
                  import DS from "ember-data";
                  export default DS.Model.extend({
                    appName: DS.attr('string')
                  });`
      },
      {
        filename: "twiddle.json",
        content: `{
                    "version": "0.12.0",
                    "EmberENV": {
                      "FEATURES": {}
                    },
                    "options": {
                      "use_pods": true,
                      "enable-testing": false
                    },
                    "dependencies": {
                      "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",
                      "ember": "3.8.1",
                      "ember-template-compiler": "3.8.1",
                      "ember-testing": "3.8.1"
                    },
                    "addons": {
                      "ember-data": "3.8.1"
                    }
                  }`
        }
    ];

    await runGist(files);

    assert.equal(outputContents(), 'Welcome to Ember Twiddle');
  });
});
