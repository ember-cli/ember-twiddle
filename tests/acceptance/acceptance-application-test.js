import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { timeout } from 'ember-concurrency';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputPane from '../helpers/output-pane';

module('Acceptance | acceptance-application-test', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cachePrompt = window.prompt;
    window.prompt = (text, defaultResponse) => defaultResponse;
  });

  hooks.afterEach(function() {
    window.prompt = this.cachePrompt;
  });

  test('An acceptance test for an application works (pre rfc232)', async function(assert) {
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
                  import jQuery from 'jquery';
                  import { assign } from '@ember/polyfills';

                  let attributes = assign({ rootElement: '#main' }, config.APP);
                  setApplication(Application.create(attributes));

                  window.testModule = 'twiddle/tests/acceptance/application-test';
                  `
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
                    attributes.autoboot = true;
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

    await runGist(files);

    await timeout(500); // TODO: fix and remove this timing hack
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '1', 'acceptance test passed');
  });



  test('An acceptance test for an application works (rfc232 format)', async function(assert) {
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

                  window.testModule = 'twiddle/tests/acceptance/application-test';
                  `
      },
      {
        filename: "tests/acceptance/application-test.js",
        content: `import { module, test } from 'qunit';
                  import { setupApplicationTest } from 'ember-qunit';
                  import { visit, currentURL } from '@ember/test-helpers';

                  module('TODO: put something here', function(hooks) {
                    setupApplicationTest(hooks);

                    test('visiting /', async function(assert) {
                      await visit('/');

                      assert.equal(currentURL(), '/', 'route loaded correctly');
                    });
                  });`
      }
    ];

    await runGist(files);

    await timeout(500); // TODO: fix and remove this timing hack
    const outputSpan = 'div#qunit-testresult-display > span.passed';

    assert.equal(outputPane().$(outputSpan).text(), '1', 'acceptance test passed');
  });
});
