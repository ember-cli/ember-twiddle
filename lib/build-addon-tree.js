/* global require, module */
function buildAddonTree(addonName) {
  const funnel = require('broccoli-funnel');
  const concat = require('broccoli-concat');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const path = require('path');
  const babelOpts = require('./babel-opts');

  let baseTree = funnel(path.dirname(require.resolve(addonName)), {
    include: ['**/*.js'],
    exclude: ['index.js', 'ember-cli-build.js', 'testem.js', 'lib/**/*.js', 'config/**/*.js', 'tests/**/*.js']
  });

  let transpiledTree = babelTranspiler(baseTree, babelOpts());

  return concat(transpiledTree, {
    inputFiles: ['**/*.js'],
    outputFile: '/assets/' + addonName + '.js'
  });
}

module.exports = buildAddonTree;