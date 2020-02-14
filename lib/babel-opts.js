/* global module */

function babelOpts() {
  return {
    moduleIds: true,
    plugins: [
      ['transform-es2015-modules-amd', {
        loose: true,
        noInterop: true
      }]
    ]
  };
}

module.exports = babelOpts;