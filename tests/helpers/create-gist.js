import Ember from "ember";
import { faker } from "ember-cli-mirage";

const { isArray } = Ember;

export default function(options) {
  if (isArray(options)) {
    options = {files: options};
  }

  const login = options.login || "Gaurav0";
  const gist_id = options.gist_id || "35de43cb81fc35ddffb2";
  const commit = options.commit || "f354c6698b02fe3243656c8dc5aa0303cc7ae81c";
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
                }
              };`
  });

  let gistFiles = [];

  files.forEach(function (file) {
    let gistFile = server.create('gist-file', {
      filename: file.filename,
      login: login,
      gist_id: gist_id,
      commit: commit,
      content: file.content
    });
    gistFiles.push(gistFile);
  });

  server.create('user', { id: faker.random.number(99999), login: login });
  const owner = server.create('owner', { id: faker.random.number(99999), login: login });

  if (isGitRevision) {
    let revision = server.create('gist-revision', {
      id: gist_id,
      revId: commit
    });
    revision.update({
      owner,
      files: gistFiles
    })
  }
  if (!options.doNotCreateGist) {
    let gist = server.create('gist', {
      id: gist_id
    });
    gist.update({
      owner,
      files: gistFiles
    })
  }

}
