import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

module('Acceptance | escaping moustaches', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('Able to escape moustache tag', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: "\\{{Moustache}}"
    }
  ];

  runGist(files);

  andThen(function() {
    const outputDiv = 'div';

    assert.equal(outputContents(outputDiv), '{{Moustache}}', 'Moustache tag is escaped');
  });
});
