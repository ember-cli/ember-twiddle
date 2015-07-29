import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

module('Acceptance | external dependency', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('Able to run a gist using an external dependency', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: "{{version}}"
    },
    {
      filename: "application.controller.js",
      content: "import Ember from 'ember';\n\nexport default Ember.Controller.extend({\n  version: _.VERSION\n});\n"
    },
    {
      filename: 'twiddle.json',
      content:
        '{\n' +
        '  "version": "0.4.0",\n' +
        '  "dependencies": {\n' +
        '    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",\n' +
        '    "ember": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.5/ember.js",\n' +
        '    "ember-template-compiler": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.5/ember-template-compiler.js",\n' +
        '    "ember-data": "https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.7/ember-data.js",\n' +
        '    "lodash": "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.0/lodash.js"\n' +
        '  }\n' +
        '}'
    }
  ];

  runGist(files);

  andThen(function() {
    const outputDiv = 'div';

    assert.equal(outputContents(outputDiv), '3.10.0', 'Gist including an external dependency can make use of it');
  });
});
