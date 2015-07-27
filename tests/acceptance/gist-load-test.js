import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

let application;

module('Acceptance | gist-load', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Able to do routing in a gist', function(assert) {
  let owner = server.create('owner', {login: 'Gaurav0'});
  server.create('gist', {
    id: '35de43cb81fc35ddffb2',
    owner: owner,
    files: {
      "about.template.hbs": {
        "filename": "about.template.hbs",
        "type": "text/plain",
        "language": "Handlebars",
        "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/b7332edd46bd97973c1dfebf495908b8abb9b301/about.template.hbs",
        "size": 17,
        "truncated": false,
        "content": "<p>About Page</p>"
      },
      "application.template.hbs": {
        "filename": "application.template.hbs",
        "type": "text/plain",
        "language": "Handlebars",
        "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/f354c6698b02fe3243656c8dc5aa0303cc7ae81c/application.template.hbs",
        "size": 87,
        "truncated": false,
        "content": "{{#link-to \"index\" class=\"test-index-link\"}}Index{{/link-to}}\n{{#link-to \"about\" class=\"test-about-link\"}}About{{/link-to}}\n\n{{outlet}}"
      },
      "index.template.hbs": {
        "filename": "index.template.hbs",
        "type": "text/plain",
        "language": "Handlebars",
        "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/60a449a6591c3bd2ba7389354146c264b13c3166/index.template.hbs",
        "size": 16,
        "truncated": false,
        "content": "<p>Main Page</p>"
      },
      "router.js": {
        "filename": "router.js",
        "type": "application/javascript",
        "language": "JavaScript",
        "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/0ef881458f8154407d50509be3598b31392d8153/router.js",
        "size": 218,
        "truncated": false,
        "content": "import Ember from 'ember';\nimport config from './config/environment';\n\nvar Router = Ember.Router.extend({\n  location: config.locationType\n});\n\nRouter.map(function() {\n  this.route(\"about\");\n});\n\nexport default Router;\n"
      },
      "twiddle.json": {
        "filename": "twiddle.json",
        "type": "application/json",
        "language": "JSON",
        "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/8b44c317f1c80721a3a74f542ca0c55a01a5badf/twiddle.json",
        "size": 303,
        "truncated": false,
        "content": "{\n  \"version\": \"0.4.0\",\n  \"dependencies\": {\n    \"jquery\": \"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js\",\n    \"ember\": \"https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.5/ember.js\",\n    \"ember-data\": \"https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.5/ember-data.js\"\n  }\n}"
      },
      "initializers/setup-test.js": {
        "filename": "initializers.setup-test.js",
        "type": "application/javascript",
        "language": "JavaScript",
        "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/0ef881458f8154407d50509be3598b31392d8153/app.js",
        "size": 218,
        "truncated": false,
        "content": "import Ember from 'ember';\n\nexport default {\n  name: 'setup-test',\n  initialize: function(container, app) {\n    app.setupForTesting();\n     app.injectTestHelpers();\n    window.QUnit = window.parent.QUnit;\n  }\n};"
      },
    }
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

  /* TODO: The following does not work! */
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
