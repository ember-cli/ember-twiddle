/* jshint node: true */

module.exports = {
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
      bucket: "ember-twiddle.com",
      region: "us-west-2"
    }
  }
};