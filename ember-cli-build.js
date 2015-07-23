/* global require, module, process */
module.exports = function() {
  var EmberApp = require('ember-cli/lib/broccoli/ember-app');
  var funnel = require('broccoli-funnel');
  var concat = require('broccoli-concat');
  var mergeTrees = require('broccoli-merge-trees');
  var pickFiles = require('broccoli-static-compiler');
  var env = EmberApp.env();
  var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;
  var prepend = null;

  if(isProductionLikeBuild) {
    prepend = env==='production' ? '//assets.ember-twiddle.com/' : '//staging-assets.ember-twiddle.com/';
  }

  var blueprintsCode = getEmberCLIBlueprints();

  var app = new EmberApp({
    fingerprint: {
      enabled: isProductionLikeBuild,
      prepend: prepend
    },
    codemirror: {
      modes: ['xml', 'javascript', 'handlebars', 'htmlmixed'],
    },
    'ember-cli-bootstrap-sassy': {
      'js': ['dropdown']
    },
    fileCreator: [{filename: '/lib/blueprints.js', content: blueprintsCode}],
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

  app.import('bower_components/ember/ember-template-compiler.js');

  var loaderTree = pickFiles('bower_components', {
    srcDir: '/loader.js',
    files: ['loader.js'],
    destDir: '/assets'
  });

  var twiddleVendorTree = concat(funnel('bower_components'),{
    inputFiles: [
      'ember-resolver/dist/modules/ember-resolver.js',
      'ember-cli-shims/app-shims.js',
      'ember-load-initializers/ember-load-initializers.js',
    ],
    outputFile: '/assets/twiddle-vendor.js',
  });

  return mergeTrees([app.toTree(), twiddleVendorTree, loaderTree]);
};

// This copies code out of ember-cli's blueprints into
// app/lib/blueprints so we don't have to maintain our
// own blueprints
function getEmberCLIBlueprints() {
  var fs = require('fs');
  var fileMap = {};
  var cliPath = 'node_modules/ember-cli';
  var cliBlueprintFiles = {
    'app': 'app/files/app/app.js',
    'router': 'app/files/app/router.js',
    'config': 'app/files/config/environment.js',
    'component-js': 'component/files/__root__/__path__/__name__.js',
    'model': 'model/files/__root__/__path__/__name__.js',
    'route': 'route/files/__root__/__path__/__name__.js',
    'controller': 'controller/files/__root__/__path__/__name__.js'
  };

  for (var blueprintName in cliBlueprintFiles) {
    var filePath = cliPath + '/blueprints/' + cliBlueprintFiles[blueprintName];
    fileMap[blueprintName] = fs.readFileSync(filePath).toString();
  }

  return 'export default ' + JSON.stringify(fileMap);
}
