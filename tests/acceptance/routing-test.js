import Ember from "ember";
import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

const { Test } = Ember;

moduleForAcceptance('Acceptance | routing', {
  beforeEach: function() {
    this.registerWaiter = () => {
      window.messagesWaiting = 1;
      this._waiter = () => {
        return window.messagesWaiting === 0;
      };
      Test.registerWaiter(this._waiter);
    };
  },

  afterEach: function() {
    window.messagesWaiting = 0;
    if (this._waiter) {
      Test.unregisterWaiter(this._waiter);
      this._waiter = null;
    }
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
                location: 'hash'
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
                  "ember": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.10/ember.debug.js",
                  "ember-data": "https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.13/ember-data.js",
                  "ember-template-compiler": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.10/ember-template-compiler.js",
                  "ember-testing": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.10/ember-testing.js"
                }
              }`
  }
];

test('Able to do routing in a gist', function(assert) {
  let iframe_window;

  runGist(TWIDDLE_WITH_ROUTES);

  andThen(() => {
    if (!find(addressBar).val()) {
      this.registerWaiter();
    }
  });

  andThen(() => {
    assert.equal(find(addressBar).val(), '/', "Correct URL is shown in address bar 0");
    assert.ok(decodeURIComponent(currentURL()).indexOf("route=") === -1, "URL is not added to route query string parameter 0");

    this.registerWaiter();
    iframe_window = outputPane();
    iframe_window.click(iframe_window.find(aboutLink));
  });

  andThen(() => {
    assert.equal(outputContents(outletText), 'About Page', 'About Link leads to About Page being displayed');
    assert.equal(find(addressBar).val(), '/about', "Correct URL is shown in address bar 1");
    assert.ok(decodeURIComponent(currentURL()).indexOf("route=/about") > 0, "URL is added to route query string parameter 1");

    this.registerWaiter();
    iframe_window.click(iframe_window.find(indexLink));
  });

  andThen(() => {
    assert.equal(outputContents(outletText), 'Main Page', 'Index Link leads to Main Page being displayed');
    assert.equal(find(addressBar).val(), '/', "Correct URL is shown in address bar 2");
    assert.ok(decodeURIComponent(currentURL()).indexOf("route=") === -1, "URL is not added to route query string parameter 2");
  });
});

test('URL can be changed via the address bar', function(assert) {
  runGist(TWIDDLE_WITH_ROUTES);

  andThen(() => {
    if (!find(addressBar).val()) {
      this.registerWaiter();
    }
  });

  andThen(function() {
    assert.equal(find(addressBar).val(), '/', "Correct URL is shown in address bar 0");

    click(addressBar);
    fillIn(addressBar, '/about');
    keyEvent(addressBar, 'keyup', 13);
  });

  andThen(function() {
    assert.equal(outputContents(outletText), 'About Page', 'Changing the URL to /about and pressing enter leads to the About Page being displayed');
    assert.equal(find(addressBar).val(), '/about', "Correct URL is shown in address bar 1");

    click(addressBar);
    fillIn(addressBar, '/');
    keyEvent(addressBar, 'keyup', 13);
  });

  andThen(function() {
    assert.equal(outputContents(outletText), 'Main Page', 'Changing the URL to / and pressing enter leads to the Main Page being displayed');
    assert.equal(find(addressBar).val(), '/', "Correct URL is shown in address bar 2");
  });
});

test('URL can be set via route query parameter', function(assert) {
  runGist({
    files: TWIDDLE_WITH_ROUTES,
    initialRoute: "/about"
  });

  andThen(() => {
    if (!find(addressBar).val()) {
      this.registerWaiter();
    }
  });

  andThen(function() {
    assert.equal(find(addressBar).val(), "/about", "Correct URL appears when set via query parameter");
    assert.equal(outputContents(outletText), 'About Page', 'Initializing the URL to /about leads to the About Page being displayed');
  });
});
