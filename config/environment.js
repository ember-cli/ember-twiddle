/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-twiddle',
    version: '0.3.5',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    githubOauthUrl: 'http://localhost:9999/authenticate/',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      rootElement: '#main-app'
    },

    torii: {
      sessionServiceName: 'session',
      providers: {
        'github-oauth2': {
          scope: 'gist',
          apiKey: '2999fbfe342248c88a91'
        }
      }
    }

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.githubOauthUrl = 'https://ember-twiddle.herokuapp.com/authenticate/';
    ENV.torii = {
      sessionServiceName: 'session',
      providers: {
        'github-oauth2': {
          scope: 'gist',
          apiKey: 'ce757a68eba4c4400b96'
        }
      }
    };
  }

  return ENV;
};
