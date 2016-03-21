import Ember from 'ember';

const EMBER_VERSIONS = ['2.4.3', '2.3.2', '2.2.2', '2.1.2', '2.0.3', '1.13.13', '1.12.2'];
const EMBER_DATA_VERSIONS = ['2.4.0', '2.3.3', '2.2.1', '2.1.0', '2.0.1', '1.13.15'];

const VERSION_REGEX = /^\d+.\d+.\d+(-beta\.\d+)?$/;

const CDN_MAP = {
  'ember': {
    library: 'ember.js',
    fileName: 'ember.debug.js'
  },

  'ember-template-compiler': {
    library: 'ember.js',
    fileName: 'ember-template-compiler.js'
  },

  'ember-data': {
    library: 'ember-data.js',
    fileName: 'ember-data.js'
  }
};

const CHANNEL_FILENAME_MAP = {
  'ember': 'ember.debug.js',
  'ember-template-compiler': 'ember-template-compiler.js',
  'ember-data': 'ember-data.js'
};

const CHANNELS = ['release', 'beta', 'canary'];

const { computed, RSVP } = Ember;

export default Ember.Service.extend({
  resolveDependencies: function(dependencies) {
    Object.keys(dependencies).forEach((name) => {
      var value = dependencies[name];

      dependencies[name] = this.resolveDependency(name, value);
    });
  },

  resolveAddons: function(addons, dependencies) {
    let addonPromises = {};
    Object.keys(addons).forEach((name) => {
      var value = addons[name];

      addonPromises[name] = this.resolveAddon(name, value);
    });

    return RSVP.hash(addonPromises).then(hash => {
      Object.keys(addons).forEach((name) => {
        let addon = hash[name];
        if(addon.status === 'build_success') {
          dependencies[name] = addon.addon_js;
          dependencies[name+'_css'] = addon.addon_css;
          console.log(`Addon ${name} is loaded...`);
        }
        else if (addon.status === 'building') {
          console.log(`Addon ${name} is currently building...`);
          console.log(`Joost will have to implement some sort of refresh logic here..`);
        }
        else if (addon.status === 'build_error') {
          console.error(`Addon ${name} encountered a build error:`);
          console.error(addon.errors, addon.ember_errors);
          console.log(`Joost will have to implement some sort of error logic here..`);
        }
      });
      return RSVP.resolve(dependencies);
    });
  },

  resolveAddon(name, value) {
    return new RSVP.Promise(function(resolve) {
      const url = `https://nl1fctyzr7.execute-api.us-east-1.amazonaws.com/staging/addon?addon=${name}&addon_version=${value}&ember_version=1.13.15`;
      resolve(Ember.$.getJSON(url).then(data => RSVP.resolve(data)));
    });
  },

  resolveDependency: function(name, value) {
    switch (name) {
      case 'ember':
      case 'ember-template-compiler':
      case 'ember-data':
        return this.resolveEmberDependency(name, value);

      default:
        return value;
    }
  },

  resolveEmberDependency: function(name, value) {
    if (VERSION_REGEX.test(value)) {
      return this.cdnURL(name, value);
    }

    if (CHANNELS.indexOf(value) !== -1) {
      return this.channelURL(name, value);
    }

    return value;
  },

  channelURL: function(name, channel) {
    var fileName = CHANNEL_FILENAME_MAP[name];

    return `//s3.amazonaws.com/builds.emberjs.com/${channel}/${fileName}`;
  },

  cdnURL: function(name, version) {
    var { library, fileName } = CDN_MAP[name];

    return `//cdnjs.cloudflare.com/ajax/libs/${library}/${version}/${fileName}`;
  },

  emberVersions: computed(function() {
    return [...CHANNELS, ...EMBER_VERSIONS];
  }),

  emberDataVersions: computed(function() {
    return [...CHANNELS, ...EMBER_DATA_VERSIONS];
  })
});
