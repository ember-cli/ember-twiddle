/* global require, module */

const DEBUG = false;

function buildQUnitTree(app) {
  const funnel = require('broccoli-funnel');
  const concat = require('broccoli-concat');
  const replace = require('broccoli-string-replace');
  const mergeTrees = require('broccoli-merge-trees');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const Rollup = require('broccoli-rollup');
  const path = require('path');
  const babelOpts = require('./babel-opts');
  const typeScriptOpts = require('./typescript-opts');
  const { debug } = require('broccoli-stew');

  let preprocessJs = app.registry.registry.js[0].toTree;

  let buildPreprocessedAddon = function(addonName, dir) {
    return preprocessJs(path.dirname(require.resolve(addonName)) + '/' + dir, {
      registry: app.registry
    });
  };

  let waitersTree = buildPreprocessedAddon('ember-test-waiters', 'addon');
  let qunitTree = buildPreprocessedAddon('ember-qunit', 'addon-test-support');
  let testHelpersTreeForQUnit = buildPreprocessedAddon('@ember/test-helpers', 'addon-test-support');

  if (DEBUG) {
    waitersTree = debug(waitersTree)
  }

  let testLoaderTreeForQUnit = funnel("node_modules/ember-cli-test-loader/addon-test-support", {
    files: ['index.js']
  });

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

  waitersTree = babelTranspiler(waitersTree, typeScriptOpts());
  qunitTree = babelTranspiler(qunitTree, babelOpts());
  testHelpersTreeForQUnit = babelTranspiler(testHelpersTreeForQUnit, babelOpts());
  testLoaderTreeForQUnit = babelTranspiler(testLoaderTreeForQUnit, babelOpts());

  if (DEBUG) {
    waitersTree = debug(waitersTree)
  }

  waitersTree = replace(waitersTree, {
    files: ['**/*.js'],
    pattern: {
      match: /define\("(.*)"/,
      replacement: "define(\"ember-test-waiters/$1\""
    }
  });

  waitersTree = replace(waitersTree, {
    files: ['**/*.js'],
    pattern: {
      match: /_types\.(\w+)/g,
      replacement: "void 0"
    }
  });

  if (DEBUG) {
    waitersTree = debug(waitersTree)
  }

  let finalQUnitTree = concat(mergeTrees([waitersTree, qunitTree, testHelpersTreeForQUnit, testLoaderTreeForQUnit]), {
    inputFiles: ['**/*.js'],
    outputFile: '/assets/ember-qunit.js'
  });

  if (DEBUG) {
    finalQUnitTree = debug(finalQUnitTree);
  }

  return finalQUnitTree;
}

module.exports = buildQUnitTree;
