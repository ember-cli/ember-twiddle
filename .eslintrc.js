module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  globals: {
    andThen: true,
    click: true,
    createGist: true,
    currentRouteName: true,
    currentURL: true,
    fillIn: true,
    keyEvent: true,
    outputContents: true,
    outputPane: true,
    runGist: true,
    runRevision: true,
    server: true,
    triggerEvent: true,
    visit: true,
    waitForLoadedIFrame: true,
    waitForUnloadedIFrame: true,
    '$': true,
    CodeMirror: false
  },
  rules: {
    'ember/new-module-imports': 'off'
  },
  overrides: [
    // node files
    {
      files: [
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      globals: {
        self: true
      }
    },

    // mirage files
    {
      files: ['mirage/**'],
      rules: {
        'ember/avoid-leaking-state-in-ember-objects': 'off'
      }
    },

    // test files
    {
      files: ['tests/**/*.js'],
      excludedFiles: ['tests/dummy/**/*.js'],
      env: {
        embertest: true
      }
    }
  ]
};
