import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { timeout } from 'ember-concurrency';
import runGist from '../helpers/run-gist';
import outputPane from '../helpers/output-pane';

module('Acceptance | integration-component-test', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cachePrompt = window.prompt;
    window.prompt = (text, defaultResponse) => defaultResponse;
  });

  hooks.afterEach(function() {
    window.prompt = this.cachePrompt;
  });

  test('An integration test for a component works (pre rfc232)', async function(assert) {
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
                      "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",
                      "ember": "3.12.1",
                      "ember-template-compiler": "3.12.1",
                      "ember-testing": "3.12.1"
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
                  } from '@ember/test-helpers';
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

    await runGist(files);

    await timeout(500); // TODO: fix and remove this timing hack
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '2', 'integration test passed');
  });
  test('An integration test for a component works (rfc232 format)', async function(assert) {
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
        content: `import Application from '../app';
                  import config from '../config/environment';
                  import { setApplication } from '@ember/test-helpers';
                  import { assign } from '@ember/polyfills';

                  let attributes = assign({ rootElement: '#main', autoboot: false }, config.APP);
                  setApplication(Application.create(attributes));

                  window.testModule = 'twiddle/tests/integration/components/my-component-test';
                  `
      },
      {
        filename: "tests/integration/components/my-component-test.js",
        content: `import { module, test } from 'qunit';
                  import { render } from '@ember/test-helpers';
                  import { setupRenderingTest } from 'ember-qunit';
                  import hbs from 'htmlbars-inline-precompile';

                  module('my-component', 'TODO: put something here', function(hooks) {
                    setupRenderingTest(hooks);

                    test('it renders', async function(assert) {

                      await render(hbs\`{{my-component}}\`);

                      assert.equal(this.element.textContent.trim(), '');

                      // Template block usage:
                      await render(hbs\`
                        {{#my-component}}
                          template block text
                        {{/my-component}}
                      \`);

                      assert.equal(this.element.textContent.trim(), 'template block text');
                    });
                  });`
      }
    ];

    await runGist(files);

    await timeout(500); // TODO: fix and remove this timing hack
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '2', 'integration test passed');
  });
});
