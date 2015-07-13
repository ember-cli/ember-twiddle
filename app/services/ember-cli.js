import Babel from "npm:babel";
import blueprints from '../lib/blueprints';

/**
 * A tiny browser version of the CLI build chain.
 * or more realistically: a hacked reconstruction of it.
 *
 * Parts of this module are directly copied from the ember-cli
 * source code at https://github.com/ember-cli/ember-cli
 */
export default Em.Service.extend({

  /**
   * Build a gist into an Ember app.
   *
   * @param  {Gist} gist    Gist to build
   * @return {String}       Source code for built Ember app
   */
  compileGist (gist) {
    var promise = new Em.RSVP.Promise((resolve, reject) => {
      var errors = [];
      var out = gist.get('files').map(file => {
        try {
          switch(file.get('extension')) {
            case '.js':
              return this.compileJs(file.get('content'), file.get('nameWithModule'));
            case '.hbs':
              return this.compileHbs(file.get('content'), file.get('nameWithModule'));
          }
        }
        catch(e) {
          e.message = '%@: %@'.fmt(file.get('nameWithModule'), e.message);
          errors.push(e);
        }
      });

      if (errors.length) {return reject(errors);}

      // Add app, config
      out.push(this.compileJs(blueprints.app, 'demo-app/app'));
      out.push(this.compileJs('export default {modulePrefix:"demo-app"}', 'demo-app/config/environment'));

      // Add boot code
      contentForAppBoot(out, {modulePrefix:'demo-app'});

      resolve(out.join('\n'));
    });

    return promise;
  },

  /**
   * Compile a javascript file. This means that we
   * transform it using Babel.
   *
   * @param  {String} code       ES6 module code
   * @param  {String} moduleName Name for the module
   * @return {String}            Transpiled module code
   */
  compileJs (code, moduleName) {
    return Babel.transform(code, babelOpts(moduleName)).code;
  },

  /**
   * Compile a Handlebars template into an AMD module.
   *
   * @param  {String} code       hbs code
   * @param  {String} moduleName Name for the module
   * @return {String}            AMD module code
   */
  compileHbs (code, moduleName) {
    var templateCode = Em.HTMLBars.precompile(code || '');
    return this.compileJs('export default Ember.HTMLBars.template(' + templateCode + ');', moduleName);
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

