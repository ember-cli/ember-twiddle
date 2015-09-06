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
    prepend = env==='production' ? '//assets.ember-twiddle.com/' : '//canary-assets.ember-twiddle.com/';
  }

  var blueprintsCode = getEmberCLIBlueprints();

  var app = new EmberApp({
    fingerprint: {
      enabled: isProductionLikeBuild,
      prepend: prepend
    },
    codemirror: {
      modes: ['xml', 'javascript', 'handlebars', 'htmlmixed', 'css'],
      keyMaps: ['emacs', 'sublime', 'vim']
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
  app.import('vendor/hint.min.css');
  app.import('vendor/drags.js');

  var twiddlicons = pickFiles('vendor/twiddlicon/',{
    srcDir: '/',
    include: ['**/*.woff', '**/*.eot', '**/*.ttf', '**/*.svg'],
    destDir: '/assets'
  });

  var loaderTree = pickFiles('bower_components', {
    srcDir: '/loader.js',
    files: ['loader.js'],
    destDir: '/assets'
  });

  var twiddleVendorTree = concat(funnel('bower_components'),{
    inputFiles: [
      'loader.js/loader.js',
      'ember-resolver/dist/modules/ember-resolver.js',
      'ember-cli-shims/app-shims.js',
      'ember-load-initializers/ember-load-initializers.js',
    ],
    outputFile: '/assets/twiddle-deps.js',
  });

  return mergeTrees([app.toTree(), twiddleVendorTree, loaderTree, twiddlicons]);
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
    'component-js': 'component/files/__root__/__path__/__name__.js',
    'component-hbs': 'component/files/__root__/__templatepath__/__templatename__.hbs',
    'model': 'model/files/__root__/__path__/__name__.js',
    'route': 'route/files/__root__/__path__/__name__.js',
    'controller': 'controller/files/__root__/__path__/__name__.js',
    'template': 'template/files/__root__/__path__/__name__.hbs',
  };

  for (var blueprintName in cliBlueprintFiles) {
    var filePath = cliPath + '/blueprints/' + cliBlueprintFiles[blueprintName];
    fileMap[blueprintName] = fs.readFileSync(filePath).toString();
  }

  fileMap['twiddle.json'] = fs.readFileSync('blueprints/twiddle.json').toString();
  fileMap['initializers/router'] = fs.readFileSync('blueprints/router_initializer.js').toString();
  fileMap['initializers/mouse-events'] = fs.readFileSync('blueprints/mouse_events_initializer.js').toString();
  fileMap['controllers/application'] = fs.readFileSync('blueprints/application_controller.js').toString();
  fileMap['templates/application'] = fs.readFileSync('blueprints/application_template.hbs').toString();
  fileMap['app.css'] = fs.readFileSync('blueprints/app.css').toString();
  fileMap['index.html'] = fs.readFileSync('blueprints/index.html').toString();

  return 'export default ' + JSON.stringify(fileMap);
}
