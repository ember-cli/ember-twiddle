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

const aboutLink = '.test-about-link';
const indexLink = '.test-index-link';
const addressBar = '.url-bar input';
const outletText = 'p';

const TWIDDLE_WITH_ROUTES = [
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
    content: `{{#link-to "index" class="test-index-link"}}Index{{/link-to}}
              {{#link-to "about" class="test-about-link"}}About{{/link-to}}

              {{outlet}}`
  },
  {
    filename: "router.js",
    content: `import Ember from 'ember';
              import config from './config/environment';

              var Router = Ember.Router.extend({
                location: config.locationType
              });

              Router.map(function() {
                this.route("about");
              });

              export default Router;`
  },
  {
    filename: "twiddle.json",
    content: `{
                "version": "0.4.0",
                "dependencies": {
                  "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",
                  "ember": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.10/ember.js",
                  "ember-data": "https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.13/ember-data.js",
                  "ember-template-compiler": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.10/ember-template-compiler.js"
                }
              }`
  }
];

test('Able to do routing in a gist', function(assert) {
  let iframe_window;

  runGist(TWIDDLE_WITH_ROUTES);

  andThen(function() {
    assert.equal(find(addressBar).val(), '/', "Correct URL is shown in address bar");

    iframe_window = outputPane();
    iframe_window.click(iframe_window.find(aboutLink));
  });

  andThen(function() {
    assert.equal(outputContents(outletText), 'About Page', 'About Link leads to About Page being displayed');
    assert.equal(find(addressBar).val(), '/about', "Correct URL is shown in address bar");

    iframe_window.click(iframe_window.find(indexLink));
  });

  andThen(function() {
    assert.equal(outputContents(outletText), 'Main Page', 'Index Link leads to Main Page being displayed');
    assert.equal(find(addressBar).val(), '/', "Correct URL is shown in address bar");
  });
});

test('URL can be changed via the address bar', function(assert) {
  runGist(TWIDDLE_WITH_ROUTES);

  andThen(function() {
    assert.equal(find(addressBar).val(), '/', "Correct URL is shown in address bar");
  });

  fillIn(addressBar, '/about');
  keyEvent(addressBar, 'keyup', 13);

  andThen(function() {
    assert.equal(outputContents(outletText), 'About Page', 'Changing the URL to /about and pressing enter leads to the About Page being displayed');
    assert.equal(find(addressBar).val(), '/about', "Correct URL is shown in address bar");
  });

  fillIn(addressBar, '/');
  keyEvent(addressBar, 'keyup', 13);

  andThen(function() {
    assert.equal(outputContents(outletText), 'Main Page', 'Changing the URL to / and pressing enter leads to the Main Page being displayed');
    assert.equal(find(addressBar).val(), '/', "Correct URL is shown in address bar");
  });
});
