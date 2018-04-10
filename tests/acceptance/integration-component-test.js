import { skip } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { timeout } from 'ember-concurrency';

moduleForAcceptance('Acceptance | integration-component-test', {
  beforeEach: function() {
    this.cachePrompt = window.prompt;
    window.prompt = (text, defaultResponse) => defaultResponse;
  },

  afterEach: function() {
    window.prompt = this.cachePrompt;
  }
});

skip('An integration test for a component works', function(assert) {

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
      filename: "components/my-component.js",
      content: `import Ember from 'ember';

                export default Ember.Component.extend({
                });`
    },
    {
      filename: "templates/components/my-component.hbs",
      content: `{{yield}}`
    },
    {
      filename: "tests/test-helper.js",
      content: `import resolver from './helpers/resolver';
                import {
                  setResolver
                } from 'ember-qunit';
                import jQuery from 'jquery';

                setResolver(resolver);

                window.testModule = 'twiddle/tests/integration/components/my-component-test';
                `
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
      filename: "tests/integration/components/my-component-test.js",
      content: `import { moduleForComponent, test } from 'ember-qunit';
                import hbs from 'htmlbars-inline-precompile';

                moduleForComponent('my-component', 'TODO: put something here', {
                  integration: true
                });

                test('it renders', function(assert) {

                  // Set any properties with this.set('myProperty', 'value');
                  // Handle any actions with this.on('myAction', function(val) { ... });

                  this.render(hbs\`{{my-component}}\`);

                  assert.equal(this.$().text().trim(), '');

                  // Template block usage:
                  this.render(hbs\`
                    {{#my-component}}
                      template block text
                    {{/my-component}}
                  \`);

                  assert.equal(this.$().text().trim(), 'template block text');
                });`
    }
  ];

  runGist(files);

  andThen(function() {
    return timeout(500); // TODO: fix and remove this timing hack
  });

  andThen(function() {
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '2', 'integration test passed');
  });
});
