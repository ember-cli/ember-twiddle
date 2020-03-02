import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { timeout } from 'ember-concurrency';
import runGist from '../helpers/run-gist';
import outputPane from '../helpers/output-pane';

module('Acceptance | unit-controller-test', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cachePrompt = window.prompt;
    window.prompt = (text, defaultResponse) => defaultResponse;
  });

  hooks.afterEach(function() {
    window.prompt = this.cachePrompt;
  });

  test('A unit test for controllers works (pre rfc232)', async function(assert) {
    const files = [
      {
        filename: "application.template.hbs",
        content: `Welcome to {{appName}}`
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
                    "version": "0.13.1",
                    "EmberENV": {
                      "FEATURES": {}
                    },
                    "options": {
                      "use_pods": false,
                      "enable-testing": true
                    },
                    "dependencies": {
                      "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js"
                    }
                  }`
      },
      {
        filename: "tests/test-helper.js",
        content: `import resolver from './helpers/resolver';
                  import {
                    setResolver
                  } from '@ember/test-helpers';

                  setResolver(resolver);

                  window.testModule = 'twiddle/tests/unit/controllers/application-test';`
      },
      {
        filename: "tests/helpers/resolver.js",
        content: `import Resolver from '../../resolver';
                  import config from '../../config/environment';

                  const resolver = Resolver.create();

                  resolver.namespace = {
                    modulePrefix: config.modulePrefix,
                    podModulePrefix: config.podModulePrefix
                  };

                  export default resolver;`
      },
      {
        filename: "tests/unit/controllers/application-test.js",
        content: `import { moduleFor, test } from 'ember-qunit';

                  moduleFor('controller:application', 'TODO: put something here', {
                    // Specify the other units that are required for this test.
                    // needs: ['controller:foo']
                  });

                  // Replace this with your real tests.
                  test('it exists', function(assert) {
                    let controller = this.subject();
                    assert.ok(controller);
                  });`
      }
    ];

    await runGist(files);

    await timeout(250); // TODO: fix and remove this timing hack
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '1', 'unit test passed');
  });

  test('A unit test for controllers works (rfc232 format)', async function(assert) {
    const files = [
      {
        filename: "application.template.hbs",
        content: `Welcome to {{appName}}`
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
                    "version": "0.13.1",
                    "EmberENV": {
                      "FEATURES": {}
                    },
                    "options": {
                      "use_pods": false,
                      "enable-testing": true
                    },
                    "dependencies": {
                      "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js"
                    }
                  }`
      },
      {
        filename: "tests/test-helper.js",
        content: `import Application from '../app';
                  import config from '../config/environment';
                  import { setApplication } from '@ember/test-helpers';
                  import { assign } from '@ember/polyfills';

                  let attributes = assign({ rootElement: '#main', autoboot: false }, config.APP);
                  setApplication(Application.create(attributes));

                  window.testModule = 'twiddle/tests/unit/controllers/application-test';
                  `
      },
      {
        filename: "tests/unit/controllers/application-test.js",
        content: `import { module, test } from 'qunit';
                  import { setupTest } from 'ember-qunit';

                  module('controller:application', 'TODO: put something here', function(hooks) {
                    setupTest(hooks);

                    test('it exists', function(assert) {
                      let controller = this.owner.lookup('controller:application');
                      assert.ok(controller);
                    });
                  });`
      }
    ];

    await runGist(files);

    await timeout(250); // TODO: fix and remove this timing hack
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '1', 'unit test passed');
  });
});
