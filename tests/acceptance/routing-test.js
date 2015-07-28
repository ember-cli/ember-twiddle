import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

let application;

module('Acceptance | routing', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Able to do routing in a gist', function(assert) {
  const login = "Gaurav0";
  const gist_id = "35de43cb81fc35ddffb2";
  const commit = "f354c6698b02fe3243656c8dc5aa0303cc7ae81c";

  function create_file(filename, content) {
    return server.create('gist-file', {
      filename: filename,
      login: login,
      gist_id: gist_id,
      commit: commit,
      content: content
    });
  }

  const aboutTemplate = create_file("about.template.hbs", "<p>About Page</p>");
  const indexTemplate = create_file("index.template.hbs", "<p>Main Page</p>");

  const appTemplate = create_file("application.template.hbs",
    "{{#link-to \"index\" class=\"test-index-link\"}}Index{{/link-to}}\n{{#link-to \"about\" class=\"test-about-link\"}}About{{/link-to}}\n\n{{outlet}}");

  const router = create_file("router.js",
    "import Ember from 'ember';\nimport config from './config/environment';\n\nvar Router = Ember.Router.extend({\n  location: config.locationType\n});\n\nRouter.map(function() {\n  this.route(\"about\");\n});\n\nexport default Router;\n");

  const twiddleJson = create_file("twiddle.json",
    "{\n  \"version\": \"0.4.0\",\n  \"dependencies\": {\n    \"jquery\": \"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js\",\n    \"ember\": \"https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.5/ember.js\",\n    \"ember-data\": \"https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.5/ember-data.js\"\n  }\n}");

  const setupTest = create_file("initializers.setup-test.js",
    "import Ember from 'ember';\n\nexport default {\n  name: 'setup-test',\n  initialize: function(container, app) {\n    app.setupForTesting();\n     app.injectTestHelpers();\n    window.QUnit = window.parent.QUnit;\n  }\n};");

  let files = {};
  [
    appTemplate,
    aboutTemplate,
    indexTemplate,
    router,
    twiddleJson,
    setupTest
  ].forEach(function(file) {
    files[file.filename] = file;
  });

  const owner = server.create('owner', {login: login});
  server.create('gist', {
    id: gist_id,
    owner: owner,
    files: files
  });

  const iframe = '#dummy-content-iframe';
  const aboutLink = '.ember-application .test-about-link';
  const indexLink = '.ember-application .test-index-link';
  const outletText = '.ember-application p';
  let iframe_window;

  visit('/35de43cb81fc35ddffb2');

  andThen(function() {
    iframe_window = find(iframe)[0].contentWindow;

    // Wait until iframe loads
    return new Ember.RSVP.Promise(function (resolve) {
      iframe_window.addEventListener('load', function () {
        iframe_window.removeEventListener('load');
        return resolve();
      });
    });
  });

  andThen(function() {
    iframe_window.visit('/');
  });

  andThen(function() {
    iframe_window.click(find(iframe).contents().find(aboutLink));
  });
  andThen(function() {
    assert.equal(find(iframe).contents().find(outletText).text().trim(), 'About Page', 'About Link leads to About Page being displayed');

    iframe_window.click(find(iframe).contents().find(indexLink));
  });
  andThen(function() {
    assert.equal(find(iframe).contents().find(outletText).text().trim(), 'Main Page', 'Index Link leads to Main Page being displayed');
  });
});
