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
  const buildQUnitTree = require('./lib/build-qunit-tree');
  const buildTwiddleVendorTree = require('./lib/build-twiddle-ember-tree');

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
    vendorFiles: {
      'ember-testing.js': null
    },
    SRI: {
      runsIn: "production"
    },
    fingerprint: {
      enabled: isProductionLikeBuild,
      prepend: prepend,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg', 'eot', 'ttf', 'woff', 'woff2', 'ico'],
      exclude: []
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
      },
      'babel-preset-env-standalone': {
        import: ['babel-preset-env.js']
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
  app.import('vendor/ember/ember-testing.js', {
    type: 'vendor',
    outputFile: 'ember-local-testing.js'
  });
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
  app.import('node_modules/js-untar/build/dist/untar.js');
  app.import('vendor/shims/untar.js');
  app.import('node_modules/pako/dist/pako.js');
  app.import('vendor/shims/pako.js');

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

  return app.toTree(mergeTrees([
    twiddleVendorTree,
    loaderTree,
    testLoaderTree,
    finalQUnitTree
  ]));
};


