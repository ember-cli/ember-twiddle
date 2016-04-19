import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | dependencies');

const TWIDDLE_SHOWING_VERSIONS = [
  {
    filename: "application.template.hbs",
    content: `
    <span class='ember-version'>{{emberVersion}}</span>
    <span class='ember-data-version'>{{emberDataVersion}}</span>
    `
  },
  {
    filename: "application.controller.js",
    content: `
    import Ember from 'ember';
    import DS from 'ember-data';

    export default Ember.Controller.extend({
    emberVersion: Ember.VERSION,
    emberDataVersion: DS.VERSION
    });
    `
  },
  {
    filename: 'twiddle.json',
    content: `
    {
    "dependencies": {
    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",
    "ember": "1.13.10",
    "ember-data": "1.13.15"
    }
    }
    `
  }
];

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
        '    "ember": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.10/ember.debug.js",\n' +
        '    "ember-template-compiler": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.10/ember-template-compiler.js",\n' +
        '    "ember-data": "https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.15/ember-data.js",\n' +
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

test('Able to resolve ember / ember-data dependencies via version only', function(assert) {
  runGist(TWIDDLE_SHOWING_VERSIONS);

  andThen(function() {
    assert.equal(outputContents('.ember-version'), '1.13.10');
    assert.equal(outputContents('.ember-data-version'), '1.13.15');
  });
});

test('Dependencies can be changed via the UI', function(assert) {
  runGist(TWIDDLE_SHOWING_VERSIONS);

  andThen(function() {
    assert.equal(outputContents('.ember-version'), '1.13.10');
    assert.equal(outputContents('.ember-data-version'), '1.13.15');
  });

  andThen(function() {
    click('.versions-menu .dropdown-toggle');
    click('.test-set-ember-data-version:contains("2.1.0")');

    click('.versions-menu .dropdown-toggle');
    click('.test-set-ember-version:contains("2.1.2")');

    waitForLoadedIFrame();
  });

  andThen(function() {
    assert.equal(outputContents('.ember-version'), '2.1.2');
    assert.equal(outputContents('.ember-data-version'), '2.1.0');
  });
});
