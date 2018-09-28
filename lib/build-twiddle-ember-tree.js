/* global require, module */

function buildTwiddleVendorTree() {
  const funnel = require('broccoli-funnel');
  const concat = require('broccoli-concat');
  const mergeTrees = require('broccoli-merge-trees');
  const babelTranspiler = require('broccoli-babel-transpiler');
  const babelOpts = require('./babel-opts');

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

module.exports = buildTwiddleVendorTree;
