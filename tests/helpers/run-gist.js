export default function(app, files) {
  const login = "Gaurav0";
  const gist_id = "35de43cb81fc35ddffb2";
  const commit = "f354c6698b02fe3243656c8dc5aa0303cc7ae81c";

  files.push({
    filename: "initializers.setup-test.js",
    content: `
      import Ember from 'ember';

      export default {
        name: 'setup-test',
        initialize: function() {
          var app = arguments[1] || arguments[0];

          app.setupForTesting();
          app.injectTestHelpers();

          window.QUnit = window.parent.QUnit;
        }
      };
    `
  });

  let gistFiles = {};

  files.forEach(function(file) {
    let gistFile = server.create('gist-file', {
      filename: file.filename,
      login: login,
      gist_id: gist_id,
      commit: commit,
      content: file.content
    });
    gistFiles[gistFile.filename] = gistFile;
  });

  server.create('user', {login: login});
  const owner = server.create('owner', {login: login});
  server.create('gist', {
    id: gist_id,
    owner: owner,
    files: gistFiles
  });

  visit('/35de43cb81fc35ddffb2');

  return waitForLoadedIFrame();
}
