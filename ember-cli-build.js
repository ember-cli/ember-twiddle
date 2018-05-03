/* global require, module, process */
'use strict';
module.exports = function(defaults) {
  process.env.FASTBOOT_DISABLED = true;

  const EmberApp = require('ember-cli/lib/broccoli/ember-app');
  const funnel = require('broccoli-funnel');
  const concat = require('broccoli-concat');
  const mergeTrees = require('broccoli-merge-trees');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const browserify = require('browserify');
  const path = require('path');
  const fs = require('fs');

  const env = EmberApp.env();
  const deployTarget = process.env.DEPLOY_TARGET;
  const isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;
  const isFastboot = process.env.EMBER_CLI_FASTBOOT;
  let prepend = null;

  if (isProductionLikeBuild) {
    if (deployTarget === 'production') {
      prepend = process.env.TWIDDLE_ASSET_HOST || '//assets.ember-twiddle.com/';
    }
    if (deployTarget === 'staging') {
      prepend = '//canary-assets.ember-twiddle.com/'
    }
  }

  const blueprintsCode = getEmberCLIBlueprints();

  let app = new EmberApp(defaults, {
    SRI: {
      runsIn: "production"
    },
    fingerprint: {
      enabled: isProductionLikeBuild,
      prepend: prepend,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg', 'eot', 'ttf', 'woff', 'woff2', 'ico'],
      exclude: []
    },
    codemirror: {
      modes: ['xml', 'javascript', 'handlebars', 'htmlmixed', 'css'],
      keyMaps: ['emacs', 'sublime', 'vim']
    },
    fileCreator: [
      {
        filename: '/lib/blueprints.js',
        content: blueprintsCode
      }
    ],
    nodeAssets: {
      'path-browser': {
        import: ['path.js']
      },
      'babel-standalone': {
        import: ['babel.js']
      }
    },
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
    'ember-cli-babel': {
      includePolyfill: !isFastboot
    },

    tests: true,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild
  });

  if (isFastboot) {
    let b = browserify();
    b.add(require.resolve('babel-core/browser-polyfill'));
    b.bundle(function(err, buf) {
      fs.writeFileSync('vendor/polyfill.js', buf);
    });
    app.import('vendor/polyfill.js', { prepend: true });
  }

  app.import('vendor/ember/ember-template-compiler.js');
  app.import('vendor/flat-to-nested.js');
  app.import('vendor/shims/babel.js');
  app.import('vendor/shims/path.js');
  app.import('bower_components/file-saver/FileSaver.js');

  if (!isFastboot) {
    app.import('vendor/drags.js');
  }
  app.import('vendor/bootstrap-dropdown-submenu-fix.css');
  app.import('vendor/hint.css');

  let loaderTree = funnel(path.dirname(require.resolve('loader.js')), {
    files: ['loader.js'],
    destDir: '/assets'
  });

  let testLoaderTree = funnel("node_modules/ember-cli-test-loader/addon-test-support", {
    files: ['index.js'],
    getDestinationPath: function() {
      return "assets/test-loader.js";
    }
  });
  testLoaderTree = babelTranspiler(testLoaderTree, babelOpts());

  let emberDataShims = funnel('vendor', {
    files: ['ember-data-shims.js']
  });

  let bowerTree = funnel('bower_components');
  let shimsTree = funnel('node_modules/ember-cli-shims/vendor/ember-cli-shims' , {
    destDir: 'ember-cli-shims'
  });

  let baseResolverTree = funnel('node_modules/ember-resolver/addon', {
    destDir: 'ember-resolver'
  });

  let transpiledResolverTree = babelTranspiler(baseResolverTree, babelOpts());

  let baseInitializersTree = funnel('node_modules/ember-load-initializers/addon', {
    destDir: 'ember-load-initializers'
  });

  let transpiledInitializersTree = babelTranspiler(baseInitializersTree, babelOpts());

  let finalQUnitTree = buildAddonTree('ember-qunit');
  let finalTestHelpersTree = buildAddonTree('ember-test-helpers');

  let mergedDepsTree = mergeTrees([bowerTree, shimsTree, transpiledInitializersTree, transpiledResolverTree, emberDataShims]);

  let twiddleVendorTree = concat(mergedDepsTree, {
    inputFiles: [
      'ember-cli-shims/app-shims.js',
      'ember-load-initializers/**/*.js',
      'ember-resolver/**/*.js',
      'ember-data-shims.js'
    ],
    outputFile: '/assets/twiddle-deps.js'
  });

  return app.toTree(mergeTrees([twiddleVendorTree, loaderTree, testLoaderTree, finalQUnitTree, finalTestHelpersTree]));
};

function buildAddonTree(addonName) {
  const funnel = require('broccoli-funnel');
  const concat = require('broccoli-concat');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const path = require('path');

  let baseTree = funnel(path.dirname(require.resolve(addonName)), {
    include: ['**/*.js']
  });

  let transpiledTree = babelTranspiler(baseTree, babelOpts());

  return concat(transpiledTree, {
    inputFiles: ['**/*.js'],
    outputFile: '/assets/' + addonName + '.js'
  });
}

function babelOpts() {
  return {
    presets: ['babel-preset-es2017'].map(require.resolve),
    moduleIds: true,
    plugins: [
      ['transform-es2015-modules-amd', {
        loose: true,
        noInterop: true
      }]
    ]
  };
}

// This copies code out of ember-cli's blueprints into
// app/lib/blueprints so we don't have to maintain our
// own blueprints
function getEmberCLIBlueprints() {
  const fs = require('fs');
  const path = require('path');
  let fileMap = {};

  let blueprintFiles = {
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

  for (let list in blueprintFiles) {
    let blueprintPath = blueprintFiles[list].path;
    let files = blueprintFiles[list].files;
    for (let blueprintName in files) {
      let filePath = blueprintPath + '/blueprints/' + files[blueprintName];
      fileMap[blueprintName] = fs.readFileSync(filePath).toString();
    }
  }

  // Location should be 'none' in router.js
  fileMap['router'] = fileMap['router'].replace(/config\.locationType/, "'hash'");

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
