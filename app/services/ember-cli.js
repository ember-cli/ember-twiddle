import Babel from "npm:babel-core";
import Path from 'npm:path';
import HtmlbarsInlinePrecompile from 'npm:babel-plugin-htmlbars-inline-precompile';
import blueprints from '../lib/blueprints';
import config from '../config/environment';
import Ember from 'ember';
import moment from 'moment';
import _template from "lodash/string/template";

const hbsPlugin = new HtmlbarsInlinePrecompile(Ember.HTMLBars.precompile);

const { computed, inject, RSVP, $ } = Ember;
const twiddleAppName = 'twiddle';
const oldTwiddleAppNames = ['demo-app', 'app'];

// These files will be included if not present
const boilerPlateJs = [
  'app',
  'router',
  'initializers/router',
  'initializers/mouse-events',
  'resolver'
];

// These files have to be present
const requiredFiles = [
  'twiddle.json'
];

const availableBlueprints = {
  'templates/application': {
    blueprint: 'templates/application',
    filePath: 'templates/application.hbs',
    podFilePath: 'application/templates.hbs'
  },
  'controllers/application': {
    blueprint: 'controllers/application',
    filePath: 'controllers/application.js',
    podFilePath: 'application/controller.js'
  },
  'app': {
    blueprint: 'app',
    filePath: 'app.js'
  },
  'css': {
    blueprint: 'app.css',
    filePath: 'styles/app.css'
  },
  'component-hbs': {
    blueprint: 'component-hbs',
    filePath: 'templates/components/my-component.hbs',
    podFilePath: 'my-component/template.hbs'
  },
  'component-js': {
    blueprint: 'component-js',
    filePath: 'components/my-component.js',
    podFilePath: 'my-component/component.js'
  },
  'controller': {
    blueprint: 'controller',
    filePath: 'controllers/my-route.js',
    podFilePath: 'my-route/controller.js'
  },
  'initializers/router': {
    blueprint: 'initializers/router',
    filePath: 'initializers/router.js'
  },
  'initializers/mouse-events': {
    blueprint: 'initializers/mouse-events',
    filePath: 'initializers/mouse-events'
  },
  'model': {
    blueprint: 'model',
    filePath: 'models/my-model.js'
  },
  'helper': {
    blueprint: 'helper',
    filePath: 'helpers/my-helper.js'
  },
  'route': {
    blueprint: 'route',
    filePath: 'routes/my-route.js',
    podFilePath: 'my-route/route.js'
  },
  'service': {
    blueprint: 'service',
    filePath: 'services/my-service.js'
  },
  'template': {
    blueprint: 'template',
    filePath: 'templates/my-route.hbs',
    podFilePath: 'my-route/template.hbs'
  },
  'router': {
    blueprint: 'router',
    filePath: 'router.js'
  },
  'twiddle.json': {
    blueprint: 'twiddle.json',
    filePath: 'twiddle.json'
  },
  'resolver': {
    blueprint: 'resolver',
    filePath: 'resolver.js'
  },
  'test-helper': {
    blueprint: 'test-helper',
    filePath: 'tests/test-helper.js'
  },
  'test-resolver': {
    blueprint: 'test-resolver',
    filePath: 'tests/helpers/resolver.js'
  },
  'test-start-app': {
    blueprint: 'test-start-app',
    filePath: 'tests/helpers/start-app.js'
  },
  'test-destroy-app': {
    blueprint: 'test-destroy-app',
    filePath: 'tests/helpers/destroy-app.js'
  },
  'test-module-for-acceptance': {
    blueprint: 'test-module-for-acceptance',
    filePath: 'tests/helpers/module-for-acceptance.js'
  },
  'controller-test': {
    blueprint: 'controller-test',
    filePath: 'tests/unit/controllers/my-controller-test.js'
  },
  'route-test': {
    blueprint: 'route-test',
    filePath: 'tests/unit/routes/my-route-test.js'
  },
  'service-test': {
    blueprint: 'service-test',
    filePath: 'tests/unit/services/my-service-test.js'
  },
  'component-test': {
    blueprint: 'component-test',
    filePath: 'tests/integration/components/my-component-test.js'
  },
  'acceptance-test': {
    blueprint: 'acceptance-test',
    filePath: 'tests/acceptance/my-acceptance-test.js'
  }
};

/**
 * A tiny browser version of the CLI build chain.
 * or more realistically: a hacked reconstruction of it.
 *
 * Parts of this module are directly copied from the ember-cli
 * source code at https://github.com/ember-cli/ember-cli
 */
export default Ember.Service.extend({
  store: inject.service(),
  twiddleJson: inject.service(),

  usePods: computed.readOnly('twiddleJson.usePods'),
  enableTesting: false,

  setup(gist) {
    this.get('twiddleJson').setup(gist);
  },

  generate(type) {
    return this.get('store').createRecord('gistFile', this.buildProperties(type));
  },

  buildProperties(type, replacements) {
    if (type in availableBlueprints) {
      let blueprint = availableBlueprints[type];
      let content = blueprints[blueprint.blueprint];

      if (replacements) {
        content = _template(content)(replacements);
      }

      return {
        filePath: this.get('usePods') ? blueprint.podFilePath || blueprint.filePath : blueprint.filePath,
        content: content.replace(/<\%\=(.*)\%\>/gi,'')
      };
    }
  },

  nameWithModule: function (filePath) {
    // Remove app prefix if present
    let name = filePath.replace(/^app\//, '');

    return Path.join(twiddleAppName,
      Path.dirname(name), Path.basename(name, Path.extname(name)));
  },

  /**
   * Build a gist into an Ember app.
   *
   * @param  {Gist} gist    Gist to build
   * @return {Ember Object}       Source code for built Ember app
   */
  compileGist (gist) {
    let promise = new RSVP.Promise((resolve, reject) => {
      let errors = [];
      let out = [];
      let cssOut = [];

      this.checkRequiredFiles(out, gist);

      gist.get('files').forEach(file => {
        this.compileFile(file, errors, out, cssOut);
      });

      if (errors.length) {
        return reject(errors);
      }

      this.addBoilerPlateFiles(out, gist);

      resolve(this.get('twiddleJson').getTwiddleJson(gist).then(twiddleJSON => {

        this.addConfig(out, gist, twiddleJSON);
        this.set('enableTesting', testingEnabled(twiddleJSON));

        // Add boot code
        contentForAppBoot(
          out,
          {
            modulePrefix: twiddleAppName,
            dependencies: twiddleJSON.dependencies,
            testingEnabled: testingEnabled(twiddleJSON),
            legacyTesting: legacyTesting(twiddleJSON)
          }
        );

        return RSVP.resolve(this.buildHtml(gist, out.join('\n'), cssOut.join('\n'), twiddleJSON));
      }));
    });

    return promise;
  },

  compileFile(file, errors, out, cssOut) {
    const content = file.get('content');
    const filePath = file.get('filePath');

    try {
      switch(file.get('extension')) {
        case '.js':
          out.push(this.compileJs(content, filePath));
          break;
        case '.hbs':
          out.push(this.compileHbs(content, filePath));
          break;
        case '.css':
          cssOut.push(this.compileCss(content, filePath));
          break;
        case '.json':
          break;
      }
    }
    catch(e) {
      e.message = `${file.get('filePath')}: ${e.message}`;
      errors.push(e);
    }
  },

  buildHtml (gist, appJS, appCSS, twiddleJSON) {
    if (gist.get('initialRoute')) {
      appJS += "window.location.hash='" + gist.get('initialRoute') + "';";
    }

    // avoids security error
    appJS += "window.history.pushState = function() {}; window.history.replaceState = function() {}; window.sessionStorage = undefined;";

    // Hide toolbar since it is not working
    appCSS += `\n#qunit-testrunner-toolbar, #qunit-tests a[href] { display: none; }\n`;

    let index = blueprints['index.html'];

    let { depScriptTags, depCssLinkTags, testStuff } = this.buildDependencies(twiddleJSON);

    let appScriptTag = `<script type="text/javascript">${appJS}</script>`;
    let appStyleTag = `<style type="text/css">${appCSS}</style>`;

    index = index.replace('{{content-for \'head\'}}', `${depCssLinkTags}\n${appStyleTag}`);

    let contentForBody = `${depScriptTags}\n${appScriptTag}\n${testStuff}\n`;

    if (!testingEnabled(twiddleJSON) || legacyTesting(twiddleJSON)) {
      contentForBody += '<div id="root"></div>';
    }

    index = index.replace('{{content-for \'body\'}}', contentForBody);

    // replace the {{build-timestamp}} placeholder with the number of
    // milliseconds since the Unix Epoch:
    // http://momentjs.com/docs/#/displaying/unix-offset/
    index = index.replace('{{build-timestamp}}', +moment());

    return index;
  },

  buildDependencies(twiddleJSON) {
    let deps = twiddleJSON.dependencies;
    let depCssLinkTags = '';
    let depScriptTags = '';
    let testStuff = '';

    let EmberENV = twiddleJSON.EmberENV || {};
    depScriptTags += `<script type="text/javascript">EmberENV = ${JSON.stringify(EmberENV)};</script>`;
    depScriptTags += `<script type="text/javascript" src="${config.assetsHost}assets/loader.js?${config.APP.version}"></script>`;

    Object.keys(deps).forEach(function(depKey) {
      let dep = deps[depKey];
      let extension = dep.substr(dep.lastIndexOf("."));
      extension = extension.split("?")[0];
      if (extension === '.css') {
        depCssLinkTags += `<link rel="stylesheet" type="text/css" href="${dep}">`;
      } else if (extension === '.js') {
        depScriptTags += `<script type="text/javascript" src="${dep}"></script>`;
      } else {
        console.warn("Could not determine extension of " + dep);
      }
    });

    depScriptTags += `<script type="text/javascript" src="${config.assetsHost}assets/twiddle-deps.js?${config.APP.version}"></script>`;

    if (testingEnabled(twiddleJSON)) {
      const testJSFiles = ['assets/test-loader.js', 'testem.js'];

      testJSFiles.forEach(jsFile => {
        depScriptTags += `<script type="text/javascript" src="${config.assetsHost}${jsFile}?${config.APP.version}"></script>`;
      });

      depScriptTags += `<script type="text/javascript" src="${window.assetMap.testSupport}"></script>`;

      depCssLinkTags += `<link rel="stylesheet" type="text/css" href="${config.assetsHost}assets/test-support.css?${config.APP.version}">`;

      testStuff += `
        <div id="qunit"></div>
        <div id="qunit-fixture"></div>
        <div id="ember-testing-container">
          <div id="ember-testing"></div>
        </div>
        <div id="test-root"></div>`;

      let moreCode = "requirejs.entries['ember-cli/test-loader'] = requirejs.entries['ember-cli-test-loader/test-support/index'] || requirejs.entries['assets/test-loader'] || requirejs.entries['ember-cli/test-loader'];";
      testStuff += `<script type="text/javascript">${moreCode}require("${twiddleAppName}/tests/test-helper");</script>`;
    }

    return { depScriptTags, depCssLinkTags, testStuff };
  },

  checkRequiredFiles (out, gist) {
    requiredFiles.forEach(filePath => {
      var file = gist.get('files').findBy('filePath', filePath);
      if(!file) {
        gist.get('files').pushObject(this.get('store').createRecord('gistFile', {
          filePath: filePath,
          content: blueprints[filePath]
        }));
      }
    });
  },

  addBoilerPlateFiles (out, gist) {
    boilerPlateJs.forEach(blueprintName => {
      let blueprint = availableBlueprints[blueprintName];
      if(!gist.get('files').findBy('filePath', blueprint.filePath)) {
        out.push(this.compileJs(blueprints[blueprint.blueprint], blueprint.filePath));
      }
    });
  },

  addConfig (out, gist, twiddleJson) {
    let config = {
      modulePrefix: twiddleAppName,
      TWIDDLE_ORIGIN: location.origin
    };

    config = $.extend((twiddleJson.ENV || {}), config);

    let configJs = 'export default ' + JSON.stringify(config);
    out.push(this.compileJs(configJs, 'config/environment'));
  },

  /**
   * Compile a javascript file. This means that we
   * transform it using Babel.
   *
   * @param  {String} code       ES6 module code
   * @param  {String} filePath   File path (will be used for module name)
   * @return {String}            Transpiled module code
   */
  compileJs (code, filePath) {
    code = this.fixTwiddleAppNames(code);
    let moduleName = this.nameWithModule(filePath);
    return Babel.transform(code, babelOpts(moduleName)).code;
  },

  /**
   * Compile a Handlebars template into an AMD module.
   *
   * @param  {String} code       hbs code
   * @param  {String} filePath   File path (will be used for module name)
   * @return {String}            AMD module code
   */
  compileHbs (code, filePath) {
    // TODO: Is there a way to precompile using the template compiler brought in via twiddle.json?
    // let templateCode = Ember.HTMLBars.precompile(code || '');

    // Compiles all templates at runtime.
    let moduleName = this.nameWithModule(filePath);

    const mungedCode = (code || '')
            .replace(/\\/g, "\\\\") // Prevent backslashes from being escaped
            .replace(/`/g, "\\`") // Prevent backticks from causing syntax errors
            .replace(/\$/g, "\\$"); // Allow ${} expressions in the code

    return this.compileJs('export default Ember.HTMLBars.compile(`' + mungedCode + '`, { moduleName: `' + moduleName + '`});', filePath);
  },

  compileCss(code, moduleName) {
    var prefix = "styles/";
    if (moduleName.substring(0, prefix.length) === prefix) {
        return code;
    }
    return '';
  },

  updateDependencyVersion(gist, dependencyName, version) {
    return this.get('twiddleJson').updateDependencyVersion(gist, dependencyName, version);
  },

  ensureTestingEnabled(gist) {
    return this.get('twiddleJson').ensureTestingEnabled(gist);
  },

  // For backwards compatibility with old names for the twiddle app
  fixTwiddleAppNames(code) {
    oldTwiddleAppNames.forEach((oldName) => {
      code = code.replace(new RegExp(
        `import\\ ([^]+?)\\ from\\ ([\\'\\"])${oldName}\\/`, 'g'),
        "import $1 from $2twiddle/");
    });
    return code;
  },

  setTesting(gist, enabled = true) {
    this.get('twiddleJson').setTesting(gist, enabled);
  }
});

/**
 * Generate babel options for the specified module
 * @param  {String} moduleName
 * @return {Object}            Babel options
 */
function babelOpts(moduleName) {
  return {
    modules:'amdStrict',
    moduleIds:true,
    moduleId: moduleName,
    plugins: [ hbsPlugin ]
  };
}

/**
 * Generate the application boot code
 * @param  {Array} content  Code buffer to append to
 * @param  {Object} config  App configuration
 * @return {Array}          Code buffer
 */
function contentForAppBoot (content, config) {

  // Some modules are not actually transpiled so Babel
  // doesn't recognize them properly...
  var monkeyPatchModules = [
    'ember',
    'ember-load-initializers',
    'ember-resolver'
  ];

  if ("ember-data" in config.dependencies) {
    monkeyPatchModules.push('ember-data');
  }

  monkeyPatchModules.forEach(function(mod) {
    content.push('  require("'+mod+'").__esModule=true;');
  });

  if (!config.testingEnabled || config.legacyTesting) {
    content.push('  require("' +
      config.modulePrefix +
      '/app")["default"].create(' +
      calculateAppConfig(config) +
      ');');
  }
}

/**
 * Directly copied from ember-cli
 */
function calculateAppConfig(config) {
  let appConfig = config.APP || {};
  appConfig.rootElement="#root";
  return JSON.stringify(appConfig);
}

function testingEnabled(twiddleJSON) {
  return twiddleJSON && twiddleJSON.options && twiddleJSON.options["enable-testing"];
}

function legacyTesting(twiddleJSON) {
  return twiddleJSON && twiddleJSON.options && twiddleJSON.options["legacy-testing"];
}
