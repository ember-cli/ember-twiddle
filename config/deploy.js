/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: deployTarget
    },
    'revision-data': {
      type: 'version-commit'
    },
    slack: {
      webhookURL: process.env.SLACK_WEB_HOOK_URL,
      channel: '#-ember-twiddle',
      username: 'ember-twiddle-deploy-notifications',
      didDeploy: function(context) {
        var deployMessage = _getHumanDeployMessage(context);
        return function(slack) {
          return slack.notify({
            text: deployMessage
          });
        };
      }
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
      region: "us-west-2",
      allowOverwrite: true
    };
  }

  return ENV;
};


function _getHumanDeployMessage(context) {
  var revision;
  if (context.revisionData) {
    revision = context.revisionData['revisionKey'] || context.revisionData['activatedRevisionKey'];
  }

  var projectName = context.project.name();

  var message;
  if (revision) {
    message = projectName + ' revision ' + revision;
  } else {
    message = projectName;
  }

  return message + " to " + context.deployTarget + " target";
}
