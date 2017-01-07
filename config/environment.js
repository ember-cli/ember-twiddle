/* jshint node: true */

module.exports = function(environment) {
  var rootURL = process.env.TWIDDLE_ROOT_URL || '/ember-twiddle';
  var host = process.env.GH_API_HOST || 'https://api.github.com';
  var torriGHEBaseURL = process.env.TORII_GHE_OAUTH || null;
  var torriProvider = process.env.TORII_PROVIDER || 'github-oauth2';
  var githubOauthURL = process.env.GATEKEEPER_URL || 'http://localhost:9999/authenticate/';
  var assetHost = process.env.TWIDDLE_ASSET_HOST || '/ember-twiddle/';
  var githubApiKey = process.env.GH_API_KEY || '2b84ab967ef8266ca0dc'

  var ENV = {
    modulePrefix: 'ember-twiddle',
    environment: environment,
    rootURL: rootURL,
    locationType: 'auto',
    host: host,
    githubOauthUrl: githubOauthURL,
    addonUrl: 'https://emw2ujz4u1.execute-api.us-east-1.amazonaws.com/canary/addon',
    assetsHost: assetHost,
    maxNumFilesInitiallyExpanded: 12,
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

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.rootURL = '/',
    ENV.assetsHost = '/',

    ENV['ember-cli-mirage'] = {
      enabled: false
    };
  }

  if (environment === 'test') {
    ENV.locationType = 'auto';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.host = undefined;
  }

  if (environment === 'production') {
    ENV.githubOauthUrl = githubOauthURL;
    ENV.assetsHost = assetHost;
    ENV.torii = {
      sessionServiceName: 'session',
      providers: {},
    },
    ENV.torii.proviers[torriProvider] = {
        scope: 'gist',
            apiKey: githubApiKey
    }
    // we only need to set the baseUrl if we are using GH Enterprise
    if( torriGHEBaseURL ) {
      ENV.torii.proviers[torriProvider].baseUrl = torriGHEBaseURL;
    }
    ENV.addonUrl = "https://howq105a2c.execute-api.us-east-1.amazonaws.com/production/addon";
  }

  // staging to GH Enterprise is not currently supported.
  if (environment === 'staging') {
    ENV.githubOauthUrl = 'https://canary-twiddle-gatekeeper.herokuapp.com/authenticate/';
    ENV.assetsHost = '//canary-assets.ember-twiddle.com/';
    ENV.torii = {
      sessionServiceName: 'session',
      providers: {
        'github-oauth2': {
          scope: 'gist',
          apiKey: '085e033505c9d26ec27a'
        }
      }
    };
  }

  return ENV;
};
