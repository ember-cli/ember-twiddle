import Babel from "npm:babel";
import blueprints from '../lib/blueprints';

export default Em.Service.extend({

  compileGist (gist) {
    var out = gist.get('files').map(file => {
      switch(file.get('extension')) {
        case '.js':
          return this.compileJs(file.get('content'), file.get('nameWithModule'));
        case '.hbs':
          return this.compileHbs(file.get('content'), file.get('nameWithModule'));
      }
    });

    out.push(this.compileJs(blueprints.app, 'demo-app/app'));
    out.push(this.compileJs(blueprints.router, 'demo-app/router'));
    out.push(this.compileJs('export default {modulePrefix:"demo-app"}', 'demo-app/config/environment'));
    contentForAppBoot(out, {modulePrefix:'demo-app'});
    return out.join('\n');
  },

  compileJs (code, moduleName) {
    return Babel.transform(code, babelOpts(moduleName)).code;
  },

  compileHbs (code, moduleName) {
    var templateCode = Em.HTMLBars.precompile(code || '');
    return this.compileJs('export default Ember.HTMLBars.template(' + templateCode + ');', moduleName);
  }
});

function babelOpts(moduleName) {
  return {
    modules:'amd',
    moduleIds:true,
    moduleId: moduleName
  };
}

function contentForAppBoot (content, config) {
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

function calculateAppConfig(config) {
  return JSON.stringify(config.APP || {});
}

