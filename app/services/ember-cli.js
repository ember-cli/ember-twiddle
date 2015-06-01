import Babel from "npm:babel";

var boilerPlateFiles = [
  'application.hbs',
  'router.js',
  'app.js',
];

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

    contentForAppBoot(out, {modulePrefix:'ember-twiddle'});
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
  content.push('  require("' +
    config.modulePrefix +
    '/app")["default"].create(' +
    calculateAppConfig(config) +
    ');');
}

function calculateAppConfig(config) {
  return JSON.stringify(config.APP || {});
}

