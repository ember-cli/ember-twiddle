import Resolver from 'ember/resolver';

// Todo: patch ember cli resolver to make this function not a closure
function chooseModuleName(moduleEntries, moduleName) {
  var underscoredModuleName = Em.String.underscore(moduleName);

  if (moduleName !== underscoredModuleName && moduleEntries[moduleName] && moduleEntries[underscoredModuleName]) {
    throw new TypeError("Ambiguous module names: `" + moduleName + "` and `" + underscoredModuleName + "`");
  }

  if (moduleEntries[moduleName]) {
    return moduleName;
  } else if (moduleEntries[underscoredModuleName]) {
    return underscoredModuleName;
  } else {
    // workaround for dasherized partials:
    // something/something/-something => something/something/_something
    var partializedModuleName = moduleName.replace(/\/-([^\/]*)$/, '/_$1');

    if (moduleEntries[partializedModuleName]) {
      Em.deprecate('Modules should not contain underscores. ' +
                      'Attempted to lookup "'+moduleName+'" which ' +
                      'was not found. Please rename "'+partializedModuleName+'" '+
                      'to "'+moduleName+'" instead.', false);

      return partializedModuleName;
    } else {
      return moduleName;
    }
  }
}


export default Resolver.extend({
  resolveTemplate (parsedName) {
    let templateName = parsedName.fullNameWithoutType.replace(/\./g, '/') + '.hbs';
    Em.Logger.debug('Looking up template', templateName);
    let template = this.files.findBy('name', templateName);
    if (template) { return template.get('compiled'); }
  },

  resolveOther (parsedName) {
    if (parsedName.fullName === 'router:main') {
      var Router = Em.Router.extend({
        location: 'none'
      });

      Router.map(function() {
      });

      return Router;
    } else {
      let jsFiles = this.files.filterBy('extension', '.js'),
          jsModules = jsFiles.mapBy('nameWithModule'), foundName;

      this.get('moduleNameLookupPatterns').find((item) => {
        let moduleName = item.call(this, parsedName);

        if(moduleName) {
          moduleName = chooseModuleName(jsModules, moduleName);
          if (moduleName && ~jsModules.indexOf(moduleName)) {
            foundName = moduleName;
            return moduleName;
          }
        }
      });

      if (foundName) {
        let foundFile = jsFiles.findBy('nameWithModule', foundName);

        var module = {}, exports;

        eval(foundFile.get('compiled'));

        exports = module.exports;

        if (exports['default']) { exports = exports['default']; }

        return exports;

      }
    }
  }
});
