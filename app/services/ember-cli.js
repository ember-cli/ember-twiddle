import Ember from "ember";
import Babel from "npm:babel";
import Path from 'npm:path';
import blueprints from '../lib/blueprints';
import config from "../config/environment";

const twiddleAppName = 'demo-app';

// These files will be included if not present
const boilerPlateJs = [
  'app',
  'config/environment',
  // 'router'
];

// These files have to be present
const requiredFiles = [
  'twiddle.json'
];

/**
 * A tiny browser version of the CLI build chain.
 * or more realistically: a hacked reconstruction of it.
 *
 * Parts of this module are directly copied from the ember-cli
 * source code at https://github.com/ember-cli/ember-cli
 */
export default Em.Service.extend({

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
    var promise = new Em.RSVP.Promise((resolve, reject) => {
      let errors = [];
      let out = [];
      let cssOut = [];

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
          e.message = '%@: %@'.fmt(file.get('filePath'), e.message);
          errors.push(e);
        }
      });

      if (errors.length) {
        return reject(errors);
      }

      this.checkRequiredFiles(out, gist);
      this.addBoilerPlateFiles(out, gist);

      // Add boot code
      contentForAppBoot(out, {modulePrefix: twiddleAppName});

      console.log(out.join('\n'));
      resolve(Ember.Object.create({
        code: out.join('\n'),
        styles: cssOut.join('\n'),
        twiddleJson: this.getTwiddleJson(gist)
      }));
    });

    return promise;
  },

  checkRequiredFiles (out, gist) {
    requiredFiles.forEach(filePath => {
      var file = gist.get('files').findBy('filePath', filePath);
      if(!file) {
        this.store.createRecord('gistFile', {
          filePath: filePath,
          content: blueprints[filePath]
        });
      }
    });
  },

  addBoilerPlateFiles (out, gist) {
    boilerPlateJs.forEach(filePath => {
      if(!gist.get('files').findBy('filePath', filePath)) {
        out.push(this.compileJs(blueprints[filePath], filePath));
      }
    });
  },

  getTwiddleJson (gist) {
    return JSON.parse(gist.get('files').findBy('filePath', 'twiddle.json').get('content'));
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
    let moduleName = this.nameWithModule(filePath);
    let templateCode = Em.HTMLBars.precompile(code || '');
    return this.compileJs('export default Ember.HTMLBars.template(' + templateCode + ');', moduleName);
  },

  compileCss(code, moduleName) {
    var prefix = "app/styles/";
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
    modules:'amd',
    moduleIds:true,
    moduleId: moduleName
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
    'ember-data',
    'ember/resolver',
    'ember/load-initializers'
  ];

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
  return JSON.stringify(config.APP || {});
}

