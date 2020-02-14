import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | import mixins', function(hooks) {
  setupApplicationTest(hooks);

  test('Able to import a mixin', function(assert) {

    const files = [
      {
        filename: "application.template.hbs",
        content: "Welcome to {{appName}}"
      },
      {
        filename: "application.controller.js",
        content: `import Ember from "ember";
                  import AppNameMixin from "../mixins/app-name";
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

    runGist(files);

    assert.equal(outputContents(), 'Welcome to Ember Twiddle');
  });
});
