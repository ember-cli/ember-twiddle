/* global module, require */

function babelOpts() {
  return {
    presets: ['babel-preset-es2017'].map(require.resolve),
    moduleIds: true,
    plugins: [
      ['transform-es2015-modules-amd', {
        loose: true,
        noInterop: true
      }],
      ['babel-plugin-ember-modules-api-polyfill']
    ]
  };
}

module.exports = babelOpts;