import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

module('Acceptance | import mixins', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

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

  andThen(function() {
    const outputDiv = 'div';

    assert.equal(outputContents(outputDiv), 'Welcome to Ember Twiddle');
  });
});
