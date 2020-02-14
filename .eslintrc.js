module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: ["ember"],
  extends: ["eslint:recommended", "plugin:ember/recommended"],
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
    $: true,
    CodeMirror: false
  },
  rules: {
    "ember/new-module-imports": "off",
    "ember/no-jquery": "error"
  },
  overrides: [
    // node files
    {
      files: [
        ".eslintrc.js",
        ".template-lintrc.js",
        "ember-cli-build.js",
        "testem.js",
        "blueprints/*/index.js",
        "config/**/*.js",
        "lib/*/index.js",
        "server/**/*.js"
      ],
      parserOptions: {
        sourceType: "script"
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ["node"],
      rules: Object.assign(
        {},
        require("eslint-plugin-node").configs.recommended.rules,
        // mirage files
        {
          files: ["mirage/**"],
          rules: {
            "ember/avoid-leaking-state-in-ember-objects": "off"
          }
        },

        // test files
        {
          files: ["tests/**/*.js"],
          excludedFiles: ["tests/dummy/**/*.js"],
          env: {
            embertest: true
          }
        }
      )
    }
  ]
};
