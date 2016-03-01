import Ember from "ember";

const { isArray } = Ember;

export default function(app, options) {
  if (isArray(options)) {
    options = { files: options };
  }

  const login = options.login || "Gaurav0";
  const gist_id = options.gist_id || "35de43cb81fc35ddffb2";
  const commit = options.commit || "f354c6698b02fe3243656c8dc5aa0303cc7ae81c";
  const initialRoute = options.initialRoute || "/";
  const isGitRevision = options.type === "revision";
  let files = options.files || [];

  files.push({
    filename: "initializers.setup-test.js",
    content: `import Ember from 'ember';

              export default {
                name: 'setup-test',
                initialize: function() {
                  const app = arguments[1] || arguments[0];
                  app.setupForTesting();
                  app.injectTestHelpers();
                  window.QUnit = window.parent.QUnit;
                }
              };`
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

  if (isGitRevision) {
    server.create('gist-revision', {
      id: gist_id,
      revId: commit,
      owner: owner,
      files: gistFiles
    });
  }
  server.create('gist', {
    id: gist_id,
    owner: owner,
    files: gistFiles
  });

  let url = "/" + gist_id;
  if (isGitRevision) {
    url += "/" + commit;
  }
  if (initialRoute !== "/") {
    url += "?route=" + initialRoute;
  }

  visit(url);

  return waitForLoadedIFrame(initialRoute);
}
