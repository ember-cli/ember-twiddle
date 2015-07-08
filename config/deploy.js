/* jshint node: true */

module.exports = {
  // development: {
  //   buildEnv: 'development', // Override the environment passed to the ember asset build. Defaults to 'production'
  //   store: {
  //     type: 'redis', // the default store is 'redis'
  //     host: 'localhost',
  //     port: 6379
  //   },
  //   assets: {
  //     type: 's3', // default asset-adapter is 's3'
  //     gzip: false, // if undefined or set to true, files are gziped
  //     gzipExtensions: ['js', 'css', 'svg'], // if undefined, js, css & svg files are gziped
  //     exclude: ['.DS_Store', '*-test.js'], // defaults to empty array
  //     accessKeyId: '<your-access-key-goes-here>',
  //     secretAccessKey: process.env['AWS_ACCESS_KEY'],
  //     bucket: '<your-bucket-name>'
  //   }
  // },

  // staging: {
  //   buildEnv: 'staging', // Override the environment passed to the ember asset build. Defaults to 'production'
  //   store: {
  //     host: 'staging-redis.example.com',
  //     port: 6379
  //   },
  //   assets: {
  //     accessKeyId: '<your-access-key-goes-here>',
  //     secretAccessKey: process.env['AWS_ACCESS_KEY'],
  //     bucket: '<your-bucket-name>'
  //   }
  // },

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