/* global module */

const isDebug = true;

const blacklist = {
  '@ember/debug': ['assert', 'deprecate', 'warn'],
  '@ember/application/deprecations': ['deprecate'],
};

function typescriptOptsForBabel() {
  return {
    filterExtensions: ['ts', 'js'],
    presets: [
      '@babel/preset-typescript',
      ['@babel/env', {
        targets: {
          browsers: [
            'last 2 chrome versions',
            'last 2 firefox versions',
            'last 2 safari versions',
            'last 2 edge versions'
          ]
        }
      }]
    ],
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
      ['babel-plugin-ember-modules-api-polyfill', { blacklist } ],
      [
        'babel-plugin-debug-macros',
        {
          flags: [
            {
              source: '@glimmer/env',
              flags: { DEBUG: isDebug, CI: false },
            },
          ],

          externalizeHelpers: {
            global: 'Ember',
          },

          debugTools: {
            isDebug,
            source: '@ember/debug',
            assertPredicateIndex: 1,
          },
        },
        '@ember/debug stripping',
      ],
      [
        'babel-plugin-debug-macros',
        {
          // deprecated import path https://github.com/emberjs/ember.js/pull/17926#issuecomment-484987305
          externalizeHelpers: {
            global: 'Ember',
          },

          debugTools: {
            isDebug,
            source: '@ember/application/deprecations',
            assertPredicateIndex: 1,
          },
        },
        '@ember/application/deprecations stripping',
      ],
      ['@babel/plugin-transform-typescript', {
        allExtensions: true
      }],
    ],
  };
}

module.exports = typescriptOptsForBabel;
