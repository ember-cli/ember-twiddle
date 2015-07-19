import Ember from "ember";
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
   * @return {Ember Object}       Source code for built Ember app
   */
  compileGist (gist) {
    var promise = new Em.RSVP.Promise((resolve, reject) => {
      var errors = [], out = [], cssOut = [];
      gist.get('files').forEach(file => {
        try {
          switch(file.get('extension')) {
            case '.js':
              out.push(this.compileJs(file.get('content'), file.get('nameWithModule')));
              break;
            case '.hbs':
              out.push(this.compileHbs(file.get('content'), file.get('nameWithModule')));
              break;
            case '.css':
              cssOut.push(this.compileCss(file.get('content'), file.get('nameWithModule')));
              break;
            case '.json':
              break;
          }
        }
        catch(e) {
          e.message = '%@: %@'.fmt(file.get('nameWithModule'), e.message);
          errors.push(e);
        }
      });

      if (errors.length) {return reject(errors);}

      // Add app
      out.push(this.compileJs(blueprints.app, 'demo-app/app'));

      // Add router
      if (!gist.get('files').findBy('nameWithModule', 'demo-app/router')) {
        out.push(this.compileJs(blueprints.router, 'demo-app/router'));
      }
      out.push(this.compileJs('import Router from \'demo-app/router\';\nRouter.reopen({\n  updateUrlBar: Ember.on(\'didTransition\', function() {\n    window.parent.demoAppUrl = this.get(\'url\');\n    window.parent.updateDemoAppUrl();\n  })\n});\nexport default {name: \'router\',\n initialize: function() {}\n};\n', 'demo-app/initializers/router'));

      // Add config
      out.push(this.compileJs('export default {modulePrefix:"demo-app"}', 'demo-app/config/environment'));

      // Add boot code
      contentForAppBoot(out, {modulePrefix:'demo-app'});

      var twiddleJson = gist.get('files').findBy('twiddle.json');
      if (twiddleJson) {
        twiddleJson = twiddleJson.get('content');
      } else {
        twiddleJson = '{\n  "dependencies": {\n  "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.js",\n  "ember": "http://builds.emberjs.com/tags/v1.13.4/ember.js",\n  "ember-data": "http://builds.emberjs.com/tags/v1.13.4/ember-data.js"\n  }\n}';
      }
      twiddleJson = JSON.parse(twiddleJson);

      resolve(Ember.Object.create({ code: out.join('\n'), styles: cssOut.join('\n'), twiddleJson: twiddleJson }));
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
  },

  compileCss(code, moduleName) {
    var prefix = "demo-app/styles/";
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

