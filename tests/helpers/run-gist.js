import Ember from "ember";

export default function(app, files) {
  const login = "Gaurav0";
  const gist_id = "35de43cb81fc35ddffb2";
  const commit = "f354c6698b02fe3243656c8dc5aa0303cc7ae81c";

  files.push({
    filename: "initializers.setup-test.js",
    content: "import Ember from 'ember';\n\nexport default {\n  name: 'setup-test',\n  initialize: function(container, app) {\n    app.setupForTesting();\n     app.injectTestHelpers();\n    window.QUnit = window.parent.QUnit;\n  }\n};"
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

  const owner = server.create('owner', {login: login});
  server.create('gist', {
    id: gist_id,
    owner: owner,
    files: gistFiles
  });

  let iframe_window;

  visit('/35de43cb81fc35ddffb2');

  andThen(function() {
    iframe_window = outputPane();

    // Wait until iframe loads
    return new Ember.RSVP.Promise(function (resolve) {
      iframe_window.addEventListener('load', function () {
        iframe_window.removeEventListener('load');
        resolve();
      });
    });
  });

  return andThen(function() {
    iframe_window.visit('/');
  });
}
