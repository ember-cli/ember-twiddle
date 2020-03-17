module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: 'production'
    },
    'revision-data': {
      type: 'version-commit'
    }
  };

  if (deployTarget === 'staging') {
    ENV['s3'] = {
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_ACCESS_KEY_SECRET'],
      bucket: "canary-assets.ember-twiddle.com",
      region: "us-west-2"
    };
    ENV['s3-index'] = {
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_ACCESS_KEY_SECRET'],
      bucket: "canary.ember-twiddle.com",
      region: "us-west-2",
      allowOverwrite: true
    };
  }

  // github enterprise deployements shouldn't use S3.
  if (deployTarget === 'production' && process.env.TORII_PROVIDER === 'github-oauth2') {
    ENV['s3'] = {
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_ACCESS_KEY_SECRET'],
      bucket: "assets.ember-twiddle.com",
      region: "us-west-2"
    };
    ENV['s3-index'] = {
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_ACCESS_KEY_SECRET'],
      bucket: "ember-twiddle.com",
      region: "us-west-2",
      allowOverwrite: true
    };
  }

  return ENV;
};
