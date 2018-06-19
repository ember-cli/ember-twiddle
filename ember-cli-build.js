/* global require, module, process */
module.exports = function(defaults) {
  process.env.FASTBOOT_DISABLED = true;

  const EmberApp = require('ember-cli/lib/broccoli/ember-app');
  const funnel = require('broccoli-funnel');
  const mergeTrees = require('broccoli-merge-trees');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const browserify = require('browserify');
  const path = require('path');
  const fs = require('fs');
  const babelOpts = require('./lib/babel-opts');

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

  const blueprintsCode = require('./lib/get-ember-cli-blueprints')();

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
      keyMaps: ['emacs', 'sublime', 'vim'],
      addonFiles: ['comment/comment.js']
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
  app.import('vendor/shims/babel.js');
  app.import('vendor/shims/path.js');
  app.import('bower_components/file-saver/FileSaver.js');

  if (!isFastboot) {
    app.import('vendor/drags.js');
  }
  app.import('vendor/bootstrap-dropdown-submenu-fix.css');
  app.import('vendor/hint.css');
  app.import('node_modules/compare-versions/index.js');
  app.import('vendor/shims/compare-versions.js');

  const nodeBuiltins = require('rollup-plugin-node-builtins');
  const json = require('rollup-plugin-json');

  app.import('node_modules/babel-plugin-ember-modules-api-polyfill/src/index.js', {
    using: [{
      transformation: 'cjs',
      as: 'babel-plugin-ember-modules-api-polyfill',
      plugins: [nodeBuiltins(), json()]
    }]
  });

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

  let finalQUnitTree = buildQUnitTree(app);

  let twiddleVendorTree = buildTwiddleVendorTree();

  return app.toTree(mergeTrees([twiddleVendorTree, loaderTree, testLoaderTree, finalQUnitTree]));
};

function buildQUnitTree(app) {
  const funnel = require('broccoli-funnel');
  const concat = require('broccoli-concat');
  const mergeTrees = require('broccoli-merge-trees');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const Rollup = require('broccoli-rollup');
  const path = require('path');
  const babelOpts = require('./lib/babel-opts');
  
  let preprocessJs = app.registry.registry.js[0].toTree;

  let buildPreprocessedAddon = function(addonName) {
    return preprocessJs(path.dirname(require.resolve(addonName)) + '/addon-test-support', {
      registry: app.registry
    });
  };

  let qunitTree = buildPreprocessedAddon('ember-qunit');
  let testHelpersTreeForQUnit = buildPreprocessedAddon('@ember/test-helpers');

  let testLoaderTreeForQUnit = funnel("node_modules/ember-cli-test-loader/addon-test-support", {
    files: ['index.js'],
    getDestinationPath: function() {
      return "ember-cli-test-loader/test-support/index.js";
    }
  });

  testLoaderTreeForQUnit = new Rollup(testLoaderTreeForQUnit, {
    rollup: {
      input: 'ember-cli-test-loader/test-support/index.js',
      output: {
        file: 'ember-cli-test-loader/test-support/index.js',
        format: 'es'
      },
      plugins: [
        require('rollup-plugin-commonjs')()
      ]
    }
  });

  testLoaderTreeForQUnit = babelTranspiler(testLoaderTreeForQUnit, babelOpts());

  let finalQUnitTree = concat(mergeTrees([qunitTree, testHelpersTreeForQUnit, testLoaderTreeForQUnit]), {
    inputFiles: ['**/*.js'],
    outputFile: '/assets/ember-qunit.js'
  });

  return finalQUnitTree;
}

function buildTwiddleVendorTree() {
  const funnel = require('broccoli-funnel');
  const concat = require('broccoli-concat');
  const mergeTrees = require('broccoli-merge-trees');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const babelOpts = require('./lib/babel-opts');

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

  return twiddleVendorTree;
}
