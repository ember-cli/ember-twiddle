/* global require, module, process */
module.exports = function(defaults) {
  var EmberApp = require('ember-cli/lib/broccoli/ember-app');
  var funnel = require('broccoli-funnel');
  var concat = require('broccoli-concat');
  var mergeTrees = require('broccoli-merge-trees');
  var babelTranspiler = require('broccoli-babel-transpiler');
  var browserify = require('browserify');
  var path = require('path');
  var fs = require('fs');

  var env = EmberApp.env();
  var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;
  var isFastboot = process.env.EMBER_CLI_FASTBOOT;
  var prepend = null;

  if(isProductionLikeBuild) {
     prepend = env === 'production' ? '//assets.ember-twiddle.com/' : '//canary-assets.ember-twiddle.com/';
  }

  var blueprintsCode = getEmberCLIBlueprints();

  var app = new EmberApp(defaults, {
    SRI: {
      runsIn: "production"
    },
    fingerprint: {
      enabled: isProductionLikeBuild,
      prepend: prepend,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg', 'eot', 'ttf', 'woff', 'woff2', 'ico'],
      exclude: ['test-loader', 'test-support.css', 'testem']
    },
    codemirror: {
      modes: ['xml', 'javascript', 'handlebars', 'htmlmixed', 'css'],
      keyMaps: ['emacs', 'sublime', 'vim']
    },
    'ember-cli-bootstrap-sassy': {
      'js': ['dropdown', 'collapse']
    },
    fileCreator: [
      {
        filename: '/lib/blueprints.js',
        content: blueprintsCode
      }
    ],
    sourcemaps: {
      enabled: !isProductionLikeBuild
    },
    minifyCSS: {
      enabled: isProductionLikeBuild
    },
    minifyJS: {
      enabled: isProductionLikeBuild,
      options: {
        // Fix for minification bug with Uglify & Babel: Babel depends on constructor.name === "Plugin"
        mangle: {
          except: ['Plugin']
        }
      }
    },
    babel: {
      includePolyfill: !isFastboot
    },

    tests: true,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,

    vendorFiles: {
      'ember.js': {
        staging:  'bower_components/ember/ember.prod.js'
      },
      'ember-testing.js': []
    }
  });

  if (isFastboot) {
    var b = browserify();
    b.add(require.resolve('babel/polyfill'));
    b.bundle(function(err, buf) {
      fs.writeFileSync('vendor/polyfill.js', buf);
    });
    app.import('vendor/polyfill.js', { prepend: true });
  }

  app.import('bower_components/ember/ember-template-compiler.js');

  if (env === "test") {
    app.import('bower_components/ember/ember-testing.js', { type: 'test' });
  }

  if (!isFastboot) {
    app.import('vendor/drags.js');
  }
  app.import('vendor/bootstrap-dropdown-submenu-fix.css');
  app.import('vendor/hint.css');

  var loaderTree = funnel(path.dirname(require.resolve('loader.js')), {
    files: ['loader.js'],
    destDir: '/assets'
  });

  var testLoaderTree = funnel("node_modules/ember-cli-test-loader/addon-test-support", {
    files: ['index.js'],
    getDestinationPath: function() {
      return "assets/test-loader.js";
    }
  });
  testLoaderTree = babelTranspiler(testLoaderTree, {
    modules:'amdStrict',
    moduleIds:true
  });

  var emberDataShims = funnel('vendor', {
    files: ['ember-data-shims.js']
  });

  var bowerTree = funnel('bower_components');

  var baseResolverTree = funnel('node_modules/ember-resolver/addon', {
    destDir: 'ember-resolver'
  });

  var transpiledResolverTree = babelTranspiler(baseResolverTree, {
    loose: true,
    moduleIds: true,
    modules: 'amdStrict'
  });

  var baseInitializersTree = funnel('node_modules/ember-load-initializers/addon', {
    destDir: 'ember-load-initializers'
  });

  var transpiledInitializersTree = babelTranspiler(baseInitializersTree, {
    loose: true,
    moduleIds: true,
    modules: 'amdStrict'
  });

  var mergedDepsTree = mergeTrees([bowerTree, transpiledInitializersTree, transpiledResolverTree, emberDataShims]);

  var twiddleVendorTree = concat(mergedDepsTree, {
    inputFiles: [
      'ember-cli-shims/app-shims.js',
      'ember-load-initializers/**/*.js',
      'ember-resolver/**/*.js',
      'ember-data-shims.js'
    ],
    outputFile: '/assets/twiddle-deps.js'
  });

  return mergeTrees([app.toTree(), twiddleVendorTree, loaderTree, testLoaderTree]);
};

// This copies code out of ember-cli's blueprints into
// app/lib/blueprints so we don't have to maintain our
// own blueprints
function getEmberCLIBlueprints() {
  var fs = require('fs');
  var path = require('path');
  var fileMap = {};

  var blueprintFiles = {
    "cliBlueprintFiles": {
      "path": "node_modules/ember-cli",
      "files": {
        "app": "app/files/app/app.js",
        "router": "app/files/app/router.js",
        "test-helper": 'app/files/tests/test-helper.js',
        "test-resolver": 'app/files/tests/helpers/resolver.js',
        "test-destroy-app": 'app/files/tests/helpers/destroy-app.js',
        "test-module-for-acceptance": 'app/files/tests/helpers/module-for-acceptance.js'
      }
    },
    "legacyBlueprintFiles": {
      "path": path.dirname(require.resolve('ember-cli-legacy-blueprints')),
      "files": {
        'component-hbs': 'component/files/__root__/__templatepath__/__templatename__.hbs',
        'component-js': 'component/files/__root__/__path__/__name__.js',
        'controller': 'controller/files/__root__/__path__/__name__.js',
        'route': 'route/files/__root__/__path__/__name__.js',
        'service': 'service/files/__root__/__path__/__name__.js',
        'template': 'template/files/__root__/__path__/__name__.hbs',
        'helper': 'helper/files/__root__/helpers/__name__.js',
        'controller-test': 'controller-test/qunit-files/tests/unit/__path__/__test__.js',
        'route-test': 'route-test/qunit-files/tests/unit/__path__/__test__.js',
        'service-test': 'service-test/qunit-files/tests/unit/__path__/__test__.js',
        'component-test': 'component-test/qunit-files/tests/__testType__/__path__/__test__.js',
        'acceptance-test': 'acceptance-test/qunit-files/tests/acceptance/__name__-test.js'
      }
    }
  };

  for (var list in blueprintFiles) {
    var blueprintPath = blueprintFiles[list].path;
    var files = blueprintFiles[list].files;
    for (var blueprintName in files) {
      var filePath = blueprintPath + '/blueprints/' + files[blueprintName];
      fileMap[blueprintName] = fs.readFileSync(filePath).toString();
    }
  }

  // Location should be 'none' in router.js
  fileMap['router'] = fileMap['router'].replace(/config\.locationType/, "'none'");

  fileMap['resolver'] = fs.readFileSync('app/resolver.js').toString();
  fileMap['twiddle.json'] = fs.readFileSync('blueprints/twiddle.json').toString();
  fileMap['initializers/router'] = fs.readFileSync('blueprints/router_initializer.js').toString();
  fileMap['initializers/mouse-events'] = fs.readFileSync('blueprints/mouse_events_initializer.js').toString();
  fileMap['controllers/application'] = fs.readFileSync('blueprints/application_controller.js').toString();
  fileMap['templates/application'] = fs.readFileSync('blueprints/application_template.hbs').toString();
  fileMap['app.css'] = fs.readFileSync('blueprints/app.css').toString();
  fileMap['index.html'] = fs.readFileSync('blueprints/index.html').toString();
  fileMap['test-start-app'] = fs.readFileSync('blueprints/start-app.js').toString();
  fileMap['model'] = fs.readFileSync('blueprints/model.js').toString();

  return 'export default ' + JSON.stringify(fileMap);
}
