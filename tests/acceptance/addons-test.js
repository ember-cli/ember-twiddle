import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | addons', {
  beforeEach: function() {
    this.cachePrompt = window.prompt;
    window.prompt = (text, defaultResponse) => defaultResponse;
  },

  afterEach: function() {
    window.prompt = this.cachePrompt;
  }
});

test('Addons work', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: `{{#if (gt appName.length 3)}}
                  Welcome to {{appName}}
                {{/if}}`
    },
    {
      filename: "application.controller.js",
      content: `import Ember from "ember";
                export default Ember.Controller.extend({
                  appName: 'Ember Twiddle'
                });`
    },
    {
      filename: "twiddle.json",
      content: `{
                  "version": "0.7.0",
                  "EmberENV": {
                    "FEATURES": {}
                  },
                  "options": {
                    "use_pods": true,
                    "enable-testing": false
                  },
                  "dependencies": {
                    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js",
                    "ember": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/2.4.3/ember.debug.js",
                    "ember-data": "https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/2.4.2/ember-data.js"
                  },
                  "addons": {
                    "ember-truth-helpers": "1.2.0"
                  }
                }`
    }
  ];

  runGist(files);

  andThen(function() {
    const outputDiv = 'div';

    assert.equal(outputContents(outputDiv), 'Welcome to Ember Twiddle');
  });
});
