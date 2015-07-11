import Resolver from 'ember/resolver';

export default Resolver.extend({
  resolveTemplate (parsedName) {
    return this.resolveOther(parsedName);
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
      let jsFiles = this.files,
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
        let foundFile = jsFiles.findBy('nameWithModule', foundName),
          compiled = foundFile.get('compiled');

        if(parsedName.type === 'template') {
          return compiled;
        }

        delete window.requirejs.seen[foundName];

        eval(compiled);

        return window.require(foundName);
      }
    }
  }
});
