module.exports = function(defaults) {

  const EmberApp = require('ember-cli/lib/broccoli/ember-app');
  const funnel = require('broccoli-funnel');
  const mergeTrees = require('broccoli-merge-trees');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const path = require('path');
  const babelOpts = require('./lib/babel-opts');
  const buildQUnitTree = require('./lib/build-qunit-tree');
  const buildTwiddleVendorTree = require('./lib/build-twiddle-ember-tree');

  const env = EmberApp.env();
  const deployTarget = process.env.DEPLOY_TARGET;
  const isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;
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
      '@babel/standalone': {
        import: ['babel.js']
      }
    },
    autoImport: {
      exclude: ['babel-plugin-ember-modules-api-polyfill']
    },
    'ember-cli-babel': {
      includePolyfill: true
    },

    tests: true,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild
  });

  app.import('vendor/ember/ember-template-compiler.js');
  app.import('vendor/ember/ember-testing.js', {
    type: 'vendor',
    outputFile: 'ember-local-testing.js'
  });
  app.import('vendor/shims/babel.js');
  app.import('vendor/shims/path.js');
  app.import('vendor/drags.js');
  app.import('vendor/bootstrap-dropdown-submenu-fix.css');
  app.import('vendor/hint.css');

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


