/* global require, module, process */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var env = EmberApp.env();
var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;
var prepend = null;

if(isProductionLikeBuild) {
  prepend = env==='production' ? '//assets.ember-twiddle.com/' : '//staging-assets.ember-twiddle.com/';
}

var app = new EmberApp({
  fingerprint: {
    enabled: isProductionLikeBuild,
    prepend: prepend
  },
  codemirror: {
    modes: ['xml', 'javascript', 'htmlmixed'],
  },
  'ember-cli-bootstrap-sassy': {
    'js': ['dropdown']
  },
  sourcemaps: {
    enabled: !isProductionLikeBuild,
  },
  minifyCSS: { enabled: isProductionLikeBuild },
  minifyJS: { enabled: isProductionLikeBuild },

  tests: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,
  hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,

  vendorFiles: {
    'ember.js': {
      staging:  'bower_components/ember/ember.prod.js'
    }
  }
});

// Use `app.import` to add additional libraries to the generated
// output files.
app.import('bower_components/ember/ember-template-compiler.js');

// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
