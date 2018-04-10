import { skip } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { timeout } from 'ember-concurrency';

moduleForAcceptance('Acceptance | unit-controller-test', {
  beforeEach: function() {
    this.cachePrompt = window.prompt;
    window.prompt = (text, defaultResponse) => defaultResponse;
  },

  afterEach: function() {
    window.prompt = this.cachePrompt;
  }
});

skip('A unit test for controllers works', function(assert) {

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
                } from 'ember-qunit';

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

  runGist(files);

  andThen(function() {
    return timeout(250); // TODO: fix and remove this timing hack
  });

  andThen(function() {
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '1', 'unit test passed');
  });
});
