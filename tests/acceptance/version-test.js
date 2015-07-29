import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

module('Acceptance | older version', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('Able to run a gist using an older version of Ember', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: "Hello, World!"
    },
    {
      filename: 'twiddle.json',
      content:
        '{\n' +
        '  "version": "0.4.0",\n' +
        '  "dependencies": {\n' +
        '    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",\n' +
        '    "ember": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember.js",\n' +
        '    "ember-template-compiler": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.12.1/ember-template-compiler.js",\n' +
        '    "ember-data": "https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.0.0-beta.14.1/ember-data.js"\n' +
        '  }\n' +
        '}'
    }
  ];

  runGist(files);

  andThen(function() {
    const outputDiv = 'div';

    assert.equal(outputContents(outputDiv), 'Hello, World!', 'Gist running Ember 1.12.1 is displayed');
  });
});
