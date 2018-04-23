import { skip } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { timeout } from 'ember-concurrency';

moduleForAcceptance('Acceptance | acceptance-application-test', {
  beforeEach: function() {
    this.cachePrompt = window.prompt;
    window.prompt = (text, defaultResponse) => defaultResponse;
  },

  afterEach: function() {
    window.prompt = this.cachePrompt;
  }
});

skip('An acceptance test for an application works', function(assert) {

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

                window.testModule = 'twiddle/tests/acceptance/application-test';
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
      filename: "tests/helpers/module-for-acceptance.js",
      content: `import { module } from 'qunit';
                import Ember from 'ember';
                import startApp from '../helpers/start-app';
                import destroyApp from '../helpers/destroy-app';

                const { RSVP: { Promise } } = Ember;

                export default function(name, options = {}) {
                  module(name, {
                    beforeEach() {
                      this.application = startApp();

                      if (options.beforeEach) {
                        return options.beforeEach.apply(this, arguments);
                      }
                    },

                    afterEach() {
                      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
                      return Promise.resolve(afterEach).then(() => destroyApp(this.application));
                    }
                  });
                }`
    },
    {
      filename: "tests/helpers/start-app.js",
      content: `import Ember from 'ember';
                import Application from '../../app';
                import config from '../../config/environment';

                const { run } = Ember;
                const assign = Ember.assign || Ember.merge;

                export default function startApp(attrs) {
                  let application;

                  let attributes = assign({rootElement: "#test-root"}, config.APP);
                  attributes = assign(attributes, attrs); // use defaults, but you can override;

                  run(() => {
                    application = Application.create(attributes);
                    application.setupForTesting();
                    application.injectTestHelpers();
                  });

                  return application;
                }
                `
    },
    {
      filename: "tests/helpers/destroy-app.js",
      content: `import Ember from 'ember';

                export default function destroyApp(application) {
                  Ember.run(application, 'destroy');
                }`
    },
    {
      filename: "tests/acceptance/application-test.js",
      content: `import { test } from 'qunit';
                import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

                moduleForAcceptance('TODO: put something here');

                test('visiting /application', function(assert) {
                  visit('/');

                  andThen(function() {
                    assert.equal(currentURL(), '/', 'route loaded correctly');
                  });
                });`
    }
  ];

  runGist(files);

  andThen(function() {
    return timeout(500); // TODO: fix and remove this timing hack
  });

  andThen(function() {
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '1', 'acceptance test passed');
  });
});
