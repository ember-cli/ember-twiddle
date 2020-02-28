/* global require, module */

const DEBUG = false;

function buildQUnitTree(app) {
  const funnel = require('broccoli-funnel');
  const concat = require('broccoli-concat');
  const mergeTrees = require('broccoli-merge-trees');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const Rollup = require('broccoli-rollup');
  const path = require('path');
  const babelOpts = require('./babel-opts');
  const { debug } = require('broccoli-stew');

  let preprocessJs = app.registry.registry.js[0].toTree;

  let buildPreprocessedAddon = function(addonName) {
    return preprocessJs(path.dirname(require.resolve(addonName)) + '/addon-test-support', {
      registry: app.registry
    });
  };

  let qunitTree = buildPreprocessedAddon('ember-qunit');
  let testHelpersTreeForQUnit = buildPreprocessedAddon('@ember/test-helpers');

  let testLoaderTreeForQUnit = funnel("node_modules/ember-cli-test-loader/addon-test-support", {
    files: ['index.js']
  });
  testLoaderTreeForQUnit = debug(testLoaderTreeForQUnit);

  testLoaderTreeForQUnit = new Rollup(testLoaderTreeForQUnit, {
    rollup: {
      input: 'index.js',
      output: {
        file: 'ember-cli-test-loader/test-support/index.js',
        format: 'es'
      },
      plugins: [
        require('@rollup/plugin-commonjs')()
      ]
    }
  });

  testLoaderTreeForQUnit = debug(testLoaderTreeForQUnit);

  qunitTree = babelTranspiler(qunitTree, babelOpts());
  testHelpersTreeForQUnit = babelTranspiler(testHelpersTreeForQUnit, babelOpts());
  testLoaderTreeForQUnit = babelTranspiler(testLoaderTreeForQUnit, babelOpts());

  let finalQUnitTree = concat(mergeTrees([qunitTree, testHelpersTreeForQUnit, testLoaderTreeForQUnit]), {
    inputFiles: ['**/*.js'],
    outputFile: '/assets/ember-qunit.js'
  });

  if (DEBUG) {
    finalQUnitTree = debug(finalQUnitTree);
  }

  return finalQUnitTree;
}

module.exports = buildQUnitTree;
