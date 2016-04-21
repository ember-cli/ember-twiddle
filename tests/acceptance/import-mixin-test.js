import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | import mixins');

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
