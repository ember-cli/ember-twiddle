/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: deployTarget
    },
    "revision-data": {
      type: "git-tag-commit"
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
      region: "us-west-2"
    }
  }

  if (deployTarget === 'production') {
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
      region: "us-west-2"
    }
  }

  return ENV;
};
