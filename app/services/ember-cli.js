import Babel from "npm:babel";
import Path from 'npm:path';
import HtmlbarsInlinePrecompile from 'npm:babel-plugin-htmlbars-inline-precompile';
import blueprints from '../lib/blueprints';
import config from '../config/environment';
import Ember from 'ember';
import moment from 'moment';
import _template from "lodash/string/template";

const hbsPlugin = new HtmlbarsInlinePrecompile(Ember.HTMLBars.precompile);

const { inject } = Ember;
const twiddleAppName = 'demo-app';

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

const requiredDependencies = [
  'jquery',
  'ember',
  'ember-template-compiler'
];

/**
 * A tiny browser version of the CLI build chain.
 * or more realistically: a hacked reconstruction of it.
 *
 * Parts of this module are directly copied from the ember-cli
 * source code at https://github.com/ember-cli/ember-cli
 */
export default Ember.Service.extend({
  dependencyResolver: inject.service(),
  store: inject.service(),

  usePods: false,

  setup(gist) {
    this._getTwiddleJson(gist);
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
    var promise = new Ember.RSVP.Promise((resolve, reject) => {
      let errors = [];
      let out = [];
      let cssOut = [];

      this.checkRequiredFiles(out, gist);

      gist.get('files').forEach(file => {
        try {
          switch(file.get('extension')) {
            case '.js':
              out.push(this.compileJs(file.get('content'), file.get('filePath')));
              break;
            case '.hbs':
              out.push(this.compileHbs(file.get('content'), file.get('filePath')));
              break;
            case '.css':
              cssOut.push(this.compileCss(file.get('content'), file.get('filePath')));
              break;
            case '.json':
              break;
          }
        }
        catch(e) {
          e.message = `${file.get('filePath')}: ${e.message}`;
          errors.push(e);
        }
      });

      if (errors.length) {
        return reject(errors);
      }

      this.addBoilerPlateFiles(out, gist);
      this.addConfig(out, gist);

      let twiddleJson = this.getTwiddleJson(gist);

      // Add boot code
      contentForAppBoot(out, {modulePrefix: twiddleAppName, dependencies: twiddleJson.dependencies});

      resolve(this.buildHtml(gist, out.join('\n'), cssOut.join('\n')));
    });

    return promise;
  },

  buildHtml (gist, appJS, appCSS) {
    if (gist.get('initialRoute')) {
      appJS += "window.location.hash='" + gist.get('initialRoute') + "';";
    }

    // avoids security error
    appJS += "window.history.pushState = function() {}; window.history.replaceState = function() {};";

    // Hide toolbar since it is not working
    appCSS += `\n#qunit-testrunner-toolbar, #qunit-tests a[href] { display: none; }\n`;

    let index = blueprints['index.html'];
    let twiddleJSON = this.getTwiddleJson(gist);
    let deps = twiddleJSON.dependencies;

    let depCssLinkTags = '';
    let depScriptTags ='';
    let appScriptTag = `<script type="text/javascript">${appJS}</script>`;
    let appStyleTag = `<style type="text/css">${appCSS}</style>`;
    let testStuff = '';

    let EmberENV = twiddleJSON.EmberENV || {};
    depScriptTags += `<script type="text/javascript">EmberENV = ${JSON.stringify(EmberENV)};</script>`;
    depScriptTags += `<script type="text/javascript" src="${config.assetsHost}assets/loader.js?${config.APP.version}"></script>`;

    Object.keys(deps).forEach(function(depKey) {
      let dep = deps[depKey];
      if (dep.substr(dep.lastIndexOf(".")) === '.css') {
        depCssLinkTags += `<link rel="stylesheet" type="text/css" href="${dep}">`;
      } else {
        depScriptTags += `<script type="text/javascript" src="${dep}"></script>`;
      }
    });

    depScriptTags += `<script type="text/javascript" src="${config.assetsHost}assets/twiddle-deps.js?${config.APP.version}"></script>`;

    const testingEnabled = twiddleJSON.options && twiddleJSON.options["enable-testing"];

    if (testingEnabled) {
      const testJSFiles = ['assets/test-loader.js', 'assets/test-support.js', 'testem.js'];

      testJSFiles.forEach(jsFile => {
        depScriptTags += `<script type="text/javascript" src="${config.assetsHost}${jsFile}?${config.APP.version}"></script>`;
      });

      depCssLinkTags += `<link rel="stylesheet" type="text/css" href="${config.assetsHost}assets/test-support.css?${config.APP.version}">`;

      testStuff += `
        <div id="qunit"></div>
        <div id="qunit-fixture"></div>
        <div id="ember-testing-container">
          <div id="ember-testing"></div>
        </div>
        <div id="test-root"></div>`;

      testStuff += `<script type="text/javascript">require("demo-app/tests/test-helper");</script>`;
    }

    index = index.replace('{{content-for \'head\'}}', `${depCssLinkTags}\n${appStyleTag}`);
    index = index.replace('{{content-for \'body\'}}', `${depScriptTags}\n${appScriptTag}\n${testStuff}\n<div id="root"></div>`);

    // replace the {{build-timestamp}} placeholder with the number of
    // milliseconds since the Unix Epoch:
    // http://momentjs.com/docs/#/displaying/unix-offset/
    index = index.replace('{{build-timestamp}}', +moment());

    return index;
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

  addConfig (out) {
    let config = {
      modulePrefix: "demo-app",
      TWIDDLE_ORIGIN: location.origin
    };

    let configJs = 'export default ' + JSON.stringify(config);
    out.push(this.compileJs(configJs, 'config/environment'));
  },

  _getTwiddleJson(gist) {
    let twiddleJson = gist.get('files').findBy('filePath', 'twiddle.json');

    if (!twiddleJson) {
      return;
    }

    twiddleJson = JSON.parse(twiddleJson.get('content'));

    // set usePods
    this.set('usePods', (twiddleJson.options && twiddleJson.options['use_pods']) || false);

    return twiddleJson;
  },

  getTwiddleJson (gist) {
    let twiddleJson = this._getTwiddleJson(gist);

    // Fill in any missing required dependencies
    let dependencies = JSON.parse(blueprints['twiddle.json']).dependencies;
    requiredDependencies.forEach(function(dep) {
      if (!twiddleJson.dependencies[dep] && dependencies[dep]) {
        if (dep === 'ember-template-compiler') {
          twiddleJson.dependencies[dep] = twiddleJson.dependencies['ember'].replace('ember.debug.js', 'ember-template-compiler.js');
        } else {
          twiddleJson.dependencies[dep] = dependencies[dep];
        }
      }
    });

    const dependencyResolver = this.get('dependencyResolver');
    dependencyResolver.resolveDependencies(twiddleJson.dependencies);

    return twiddleJson;
  },

  _updateTwiddleJson(gist, updateFn) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const twiddle = gist.get('files').findBy('filePath', 'twiddle.json');

      let json;
      try {
        json = JSON.parse(twiddle.get('content'));
      } catch (e) {
        return reject(e);
      }

      json = updateFn(json);

      json = JSON.stringify(json, null, '  ');
      twiddle.set('content', json);

      resolve();
    });
  },

  updateDependencyVersion(gist, dependencyName, version) {
    return this._updateTwiddleJson(gist, (json) => {
      json.dependencies[dependencyName] = version;

      // since ember and ember-template-compiler should always have the same
      // version, we update the version for the ember-template-compiler too, if
      // the ember dependency is updated
      if (dependencyName === 'ember' && json.dependencies.hasOwnProperty('ember-template-compiler')) {
        json.dependencies['ember-template-compiler'] = version;
      }

      return json;
    });
  },

  ensureTestingEnabled(gist) {
    return this._updateTwiddleJson(gist, (json) => {
      if (!json.options) {
        json.options = {};
      }
      json.options["enable-testing"] = true;
      return json;
    });
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
            .replace(/`/g, "\\`"); // Prevent backticks from causing syntax errors

    return this.compileJs('export default Ember.HTMLBars.compile(`' + mungedCode + '`, { moduleName: `' + moduleName + '`});', filePath);
  },

  compileCss(code, moduleName) {
    var prefix = "styles/";
    if (moduleName.substring(0, prefix.length) === prefix) {
        return code;
    }
    return '';
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

  content.push('  require("' +
    config.modulePrefix +
    '/app")["default"].create(' +
    calculateAppConfig(config) +
    ');');
}

/**
 * Directly copied from ember-cli
 */
function calculateAppConfig(config) {
  let appConfig = config.APP || {};
  appConfig.rootElement="#root";
  return JSON.stringify(appConfig);
}
