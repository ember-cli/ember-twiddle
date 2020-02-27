/* global module */

function babelOpts() {
  return {
    presets: [['@babel/env', {
      targets: {
        browsers: [
          'last 2 chrome versions',
          'last 2 firefox versions',
          'last 2 safari versions',
          'last 2 edge versions'
        ]
      }
    }]],
    moduleIds: true,
    getModuleId(origName) {
      let i = origName.indexOf('ember-twiddle/');
      let newName = origName.substr(i + 'ember-twiddle/'.length);
      return newName;
    },
    plugins: [
      ['@babel/plugin-transform-modules-amd', {
        loose: true,
        noInterop: true
      }],
      ['@babel/plugin-proposal-decorators', {
        legacy: true
      }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      'babel-plugin-ember-modules-api-polyfill'
    ]
  };
}

module.exports = babelOpts;
