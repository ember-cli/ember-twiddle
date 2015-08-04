/* jshint node: true */

module.exports = {
  staging: {
    buildEnv: "staging",
    store: {
      type: "S3",
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_ACCESS_KEY_SECRET'],
      bucket: "canary.ember-twiddle.com",
      region: "us-west-2"
    },
    assets: {
      type: "s3",
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_ACCESS_KEY_SECRET'],
      bucket: "canary-assets.ember-twiddle.com",
      region: "us-west-2"
    }
  },
  production: {
    store: {
      type: "S3",
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_ACCESS_KEY_SECRET'],
      bucket: "ember-twiddle.com",
      region: "us-west-2"
    },
    assets: {
      type: "s3",
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_ACCESS_KEY_SECRET'],
      bucket: "assets.ember-twiddle.com",
      region: "us-west-2"
    }
  }
};