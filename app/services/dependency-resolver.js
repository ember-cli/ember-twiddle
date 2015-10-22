import Ember from 'ember';

const VERSION_REGEX = /^\d+.\d+.\d+$/;

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

export default Ember.Service.extend({
  resolveDependencies: function(dependencies) {
    Object.keys(dependencies).forEach((name) => {
      var value = dependencies[name];

      dependencies[name] = this.resolveDependency(name, value);
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

    return `http://builds.emberjs.com/${channel}/${fileName}`;
  },

  cdnURL: function(name, version) {
    var { library, fileName } = CDN_MAP[name];

    return `http://cdnjs.cloudflare.com/ajax/libs/${library}/${version}/${fileName}`;
  }
});
