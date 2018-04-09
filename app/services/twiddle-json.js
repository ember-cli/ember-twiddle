import Ember from "ember";
import blueprints from '../lib/blueprints';

const { inject, RSVP } = Ember;

const requiredDependencies = [
  'jquery',
  'ember',
  'ember-template-compiler',
  'ember-testing'
];

const dependentDependencies = [
  'ember-template-compiler',
  'ember-testing'
];

export default Ember.Service.extend({
  dependencyResolver: inject.service(),

  usePods: false,

  setup(gist) {
    return this._getTwiddleJson(gist).catch(() => {
      // do nothing if no twiddle.json
    });
  },

  _getTwiddleJson(gist) {
    return new RSVP.Promise((resolve, reject) => {
      let twiddleJson = gist.get('files').findBy('filePath', 'twiddle.json');

      if (!twiddleJson) {
        reject();
      }

      twiddleJson = JSON.parse(twiddleJson.get('content'));

      // set usePods
      this.set('usePods', (twiddleJson.options && twiddleJson.options['use_pods']) || false);

      resolve(twiddleJson);
    });
  },

  getTwiddleJson(gist) {
    return this._getTwiddleJson(gist).then((twiddleJson) => {
      // Fill in any missing required dependencies
      const dependencies = JSON.parse(blueprints['twiddle.json']).dependencies;
      requiredDependencies.forEach(function(dep) {
        if (!twiddleJson.dependencies[dep] && dependencies[dep]) {
          if (dependentDependencies.includes(dep)) {
            twiddleJson.dependencies[dep] = twiddleJson.dependencies['ember'].replace('ember.debug.js', dep + '.js');
          } else {
            twiddleJson.dependencies[dep] = dependencies[dep];
          }
        }
      });

      twiddleJson = this._dedupEmberData(twiddleJson);

      const dependencyResolver = this.get('dependencyResolver');
      const emberVersion = twiddleJson.dependencies && twiddleJson.dependencies.ember;
      const emberDataVersion = twiddleJson.dependencies && twiddleJson.dependencies['ember-data'] || twiddleJson.addons && twiddleJson.addons['ember-data'];

      this.set('versions', {
        'ember': emberVersion,
        'emberData': emberDataVersion
      });

      dependencyResolver.resolveDependencies(twiddleJson.dependencies);
      if ('addons' in twiddleJson) {
        return dependencyResolver.resolveAddons(twiddleJson.addons, twiddleJson.dependencies, emberVersion)
          .then(() => twiddleJson);
      }

      return twiddleJson;
    });
  },

  _updateTwiddleJson(gist, updateFn) {
    return new RSVP.Promise(function(resolve) {
      const twiddle = gist.get('files').findBy('filePath', 'twiddle.json');

      let json = JSON.parse(twiddle.get('content'));

      json = updateFn(json);

      json = JSON.stringify(json, null, '  ');
      twiddle.set('content', json);

      resolve();
    });
  },

  updateDependencyVersion(gist, dependencyName, version) {
    return this._updateTwiddleJson(gist, (json) => {

      // If Ember Data is brought in as an addon, update addon version,
      // else update app version.
      if (dependencyName === 'ember-data') {
        if (json.addons && json.addons[dependencyName]) {
          json.addons[dependencyName] = version;
        } else {
          json.dependencies[dependencyName] = version;
        }
        return json;
      }

      json.dependencies[dependencyName] = version;

      // since ember and ember-template-compiler should always have the same
      // version, we update the version for the ember-template-compiler too, if
      // the ember dependency is updated
      if (dependencyName === 'ember') {
        dependentDependencies.forEach((dep) => {
          if (json.dependencies.hasOwnProperty(dep)) {
            json.dependencies[dep] = version;
          }
        });
      }

      return json;
    });
  },

  ensureTestingEnabled(gist) {
    return this.setTesting(gist, true);
  },

  setTesting(gist, enabled = true) {
    return this._updateTwiddleJson(gist, (json) => {
      if (!json.options) {
        json.options = {};
      }
      json.options["enable-testing"] = enabled;
      return json;
    });
  },

  _dedupEmberData(json) {
    if (json.addons && json.addons.hasOwnProperty('ember-data')) {
      if (json.dependencies && json.dependencies.hasOwnProperty('ember-data')) {
        delete json.dependencies['ember-data'];
      }
    }
    return json;
  }
});
