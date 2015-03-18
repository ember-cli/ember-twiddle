import Resolver from 'ember/resolver';

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
          moduleName = this.chooseModuleName(jsModules, moduleName);
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
