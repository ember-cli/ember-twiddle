import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

module('Acceptance | routing', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('Able to do routing in a gist', function(assert) {

  const files = [
    {
      filename: "about.template.hbs",
      content: "<p>About Page</p>"
    },
    {
      filename: "index.template.hbs",
      content: "<p>Main Page</p>"
    },
    {
      filename: "application.template.hbs",
      content: "{{#link-to \"index\" class=\"test-index-link\"}}Index{{/link-to}}\n{{#link-to \"about\" class=\"test-about-link\"}}About{{/link-to}}\n\n{{outlet}}"
    },
    {
      filename: "router.js",
      content: "import Ember from 'ember';\nimport config from './config/environment';\n\nvar Router = Ember.Router.extend({\n  location: config.locationType\n});\n\nRouter.map(function() {\n  this.route(\"about\");\n});\n\nexport default Router;\n"
    },
    {
      filename: "twiddle.json",
      content: "{\n  \"version\": \"0.4.0\",\n  \"dependencies\": {\n    \"jquery\": \"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js\",\n    \"ember\": \"https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.5/ember.js\",\n    \"ember-data\": \"https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.5/ember-data.js\"\n  }\n}"
    }
  ];

  const aboutLink = '.test-about-link';
  const indexLink = '.test-index-link';
  const outletText = 'p';
  let iframe_window;

  runGist(files);

  andThen(function() {
    iframe_window = outputPane();

    iframe_window.click(iframe_window.find(aboutLink));
  });

  andThen(function() {
    assert.equal(outputContents(outletText), 'About Page', 'About Link leads to About Page being displayed');

    iframe_window.click(iframe_window.find(indexLink));
  });

  andThen(function() {
    assert.equal(outputContents(outletText), 'Main Page', 'Index Link leads to Main Page being displayed');
  });
});
