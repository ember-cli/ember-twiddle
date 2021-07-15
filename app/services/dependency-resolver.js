/* eslint-disable no-console */
import $ from 'jquery';

import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import RSVP from 'rsvp';
import Ember from 'ember';
import config from '../config/environment';
import { task, timeout } from 'ember-concurrency';
import compareVersions from 'compare-versions';

const {
  deprecate
} = Ember;

const EMBER_VERSIONS = ['3.25.1', '3.24.2', '3.23.1', '3.22.2', '3.21.3', '3.20.6', '3.19.0', '3.18.1', '3.17.3', '3.16.10', '3.15.0', '3.14.3', '3.13.4', '3.12.2', '3.11.1', '3.10.2', '3.9.1', '3.8.3', '3.7.3', '3.6.1', '3.5.1', '3.4.3', '3.3.2', '3.2.2', '3.1.4', '3.0.0', '2.18.2', '2.17.2', '2.16.2'];
const EMBER_DATA_VERSIONS = ['3.25.0', '3.24.1', '3.23.0', '3.22.1', '3.21.2', '3.20.5', '3.19.0', '3.18.0', '3.17.1', '3.16.9', '3.15.1', '3.14.1', '3.13.2', '3.12.5', '3.11.5', '3.10.0', '3.9.3', '3.8.1', '3.7.0', '3.6.0', '3.5.2', '3.4.2', '3.3.2', '3.2.2', '3.1.2', '3.0.4', '2.18.5', '2.17.1', '2.16.4'];

const VERSION_REGEX = /^\d+.\d+.\d+(-beta\.\d+)?$/;

const CDN_MAP = {
  'ember': {
    pakage: 'ember-source',
    library: 'ember.js',
    fileName: 'ember.debug.js'
  },

  'ember-template-compiler': {
    pakage: 'ember-source',
    library: 'ember.js',
    fileName: 'ember-template-compiler.js'
  },

  'ember-testing': {
    pakage: 'ember-source',
    library: 'ember.js',
    fileName: 'ember-testing.js'
  },

  'ember-data': {
    pakage: 'ember-data',
    library: 'ember-data.js',
    fileName: 'ember-data.js'
  }
};

const POLL_INTERVAL = 10000;

export default Service.extend({
  notify: service(),

  resolveDependencies(dependencies) {
    Object.keys(dependencies).forEach((name) => {
      let value = dependencies[name];

      dependencies[name] = this.resolveDependency(name, value);
    });
  },

  resolveAddons(addons, dependencies, emberVersion) {
    const taskInstance = this.resolveAddonsTask.perform(addons, dependencies, emberVersion);
    return taskInstance.then(() => taskInstance.value);
  },

  resolveAddonsTask: task(function *(addons, dependencies, emberVersion) {
    let done = false;
    while (!done) {
      let addonPromises = {};
      let addonNames = Object.keys(addons);
      for (let i = 0; i < addonNames.length; ++i) {
        const name = addonNames[i];
        const value = addons[name];
        addonPromises[name] = this.resolveAddon(name, value, emberVersion);
      }
      let allAddonsLoaded = true;
      try {
        let hash = yield RSVP.hash(addonPromises);
        for (let j = 0; j < addonNames.length; ++j) {
          const name = addonNames[j];
          const addon = hash[name];
          if (addon.status === 'build_success') {
            dependencies[name+'_js'] = addon.addon_js;
            dependencies[name+'_css'] = addon.addon_css;
            if (!Ember.testing) {
              console.log(`Addon ${name} is loaded...`);
            }
            delete addons[name];
          } else if (addon.status === 'building') {
            console.log(`Addon ${name} is still building...`);
            allAddonsLoaded = false;
          } else if (addon.status === 'build_error') {
            console.error(`Addon ${name} encountered a build error:`);
            if (addon.error_log) {
              console.error(addon.error_log);
            }
            allAddonsLoaded = false;
            throw addon;
          } else {
            console.error(addon);
          }
        }
      } catch(e) {
        try {
          this.notify.error(JSON.parse(e.responseText).errorMessage, {
            closeAfter: 10000
          });
        } catch(e2) {
          console.error(e);
        }
        throw e;
      }
      if (allAddonsLoaded) {
        done = true;
      } else {
        yield timeout(POLL_INTERVAL);
      }
    }
    return dependencies;
  }),

  resolveAddon(name, value, emberVersion) {
    const url = `${config.addonUrl}?ember_version=${emberVersion}&addon=${name}&addon_version=${value}`;
    return new RSVP.Promise(function(resolve) {
      $.getJSON(url).then(resolve);
    });
  },

  resolveDependency(name, value) {
    switch (name) {
      case 'ember':
      case 'ember-template-compiler':
      case 'ember-testing':
      case 'ember-data':
        return this.resolveEmberDependency(name, value);

      default:
        return value;
    }
  },

  resolveEmberDependency(name, value) {
    if (VERSION_REGEX.test(value)) {
      return this.cdnURL(name, value);
    }

    return value;
  },

  cdnURL(name, version) {
    let { pakage, library, fileName } = CDN_MAP[name];

    let deprecatedUrl = `//cdnjs.cloudflare.com/ajax/libs/${library}/${version}/${fileName}`;

    if (name === 'ember-data') {
      const msg = 'It is recommended you use ember-data as an addon';
      deprecate(msg, Ember.testing, {
        id: 'ember-twiddle.deprecate-ember-data-as-dependency',
        until: '0.16.0',
      });
      this.notify.warning(msg);

      return deprecatedUrl;
    }

    if (compareVersions(version, '2.16.0') === -1) {
      const msg = 'Versions of Ember prior to 2.16.0 are no longer supported in Ember Twiddle';
      deprecate(msg, Ember.testing, {
        id: 'ember-twiddle.deprecate-ember-versions-before-2-16',
        until: '0.17.0',
      });
      this.notify.warning(msg);

      return deprecatedUrl;
    }

    return `//cdn.jsdelivr.net/npm/${pakage}@${version}/dist/${fileName}`;
  },

  emberVersions: computed(function() {
    return EMBER_VERSIONS;
  }),

  emberDataVersions: computed(function() {
    return EMBER_DATA_VERSIONS;
  })
});
