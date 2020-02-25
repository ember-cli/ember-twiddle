import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import outputContents from '../helpers/output-contents';

module('Acceptance | demo-app name', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Able to use demo-app as name', async function(assert) {

    await testName(assert, 'demo-app');
  });

  test('Able to use app as name', async function(assert) {

    await testName(assert, 'app');
  });

  async function testName(assert, oldName) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Welcome to {{appName}}"
      },
      {
        filename: "application.controller.js",
        content: `import Ember from "ember";
                  import AppNameMixin from "${oldName}/mixins/app-name";
                  export default Ember.Controller.extend(AppNameMixin, {
                  });`
      },
      {
        filename: "mixins.app-name.js",
        content: `import Ember from "ember";
                  export default Ember.Mixin.create({
                    appName: "Ember Twiddle"
                  });`
      }
    ];

    await runGist(files);

    assert.equal(outputContents(), 'Welcome to Ember Twiddle');
  }
});
