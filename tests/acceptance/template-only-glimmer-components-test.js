import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputPane from '../helpers/output-pane';

let files = [
  {
    filename: "templates.application.hbs",
    content: `<h1>Welcome to {{this.appName}}</h1>
              <div class="test-parent">
                <MyComponent @appName={{this.appName}} />
              </div>`
  },
  {
    filename: "controllers.application.js",
    content: `import Controller from '@ember/controller';

              export default class ApplicationController extends Controller {
                appName = 'Ember Twiddle';
              }`
  },
  {
    filename: "templates.components.my-component.hbs",
    content: `{{@appName}}`
  },
  {
    filename: "twiddle.json",
    content: `{
      "version": "0.17.0",
      "EmberENV": {
        "FEATURES": {},
        "_TEMPLATE_ONLY_GLIMMER_COMPONENTS": false,
        "_APPLICATION_TEMPLATE_WRAPPER": true,
        "_JQUERY_INTEGRATION": true
      },
      "options": {
        "use_pods": false,
        "enable-testing": false
      },
      "dependencies": {
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js",
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

function setFlag(state) {
  let file = files.find(file => file.filename === 'twiddle.json');
  let twiddleJSON = JSON.parse(file.content);
  twiddleJSON.EmberENV["_TEMPLATE_ONLY_GLIMMER_COMPONENTS"] = state;
  file.content = JSON.stringify(twiddleJSON);
}

module('Acceptance | template-only-glimmer-components', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('template only glimmer components off', async function(assert) {

    setFlag(false);

    await runGist(files);

    assert.equal(outputPane().document.querySelector('.test-parent').textContent.trim(), 'Ember Twiddle', 'content loaded');
    assert.equal(outputPane().document.querySelectorAll('.test-parent>.ember-view').length, 1, 'content is inside wrapper div');
  });

  test('template only glimmer components on', async function(assert) {

    setFlag(true);

    await runGist(files);

    assert.equal(outputPane().document.querySelector('.test-parent').textContent.trim(), 'Ember Twiddle', 'content loaded');
    assert.equal(outputPane().document.querySelectorAll('.test-parent>.ember-view').length, 0, 'content is not inside wrapper div');
  });
});
