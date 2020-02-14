/* global module */

function babelOpts() {
  return {
    moduleIds: true,
    plugins: [
      ['transform-es2015-modules-amd', {
        loose: true,
        noInterop: true
      }],
      ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ]
  };
}

module.exports = babelOpts;