/* global require, module */

// This copies code out of ember-cli's blueprints into
// app/lib/blueprints so we don't have to maintain our
// own blueprints
function getEmberCLIBlueprints() {
  const fs = require('fs');
  const path = require('path');
  let fileMap = {};

  let blueprintFiles = {
    "cliBlueprintFiles": {
      "path": "node_modules/ember-cli",
      "files": {
        "app": "app/files/app/app.js",
        "router": "app/files/app/router.js"
      }
    },
    "legacyBlueprintFiles": {
      "path": path.dirname(require.resolve('ember-cli-legacy-blueprints')),
      "files": {
        'component-hbs': 'component/files/__root__/__templatepath__/__templatename__.hbs',
        'component-js': 'component/files/__root__/__path__/__name__.js',
        'controller': 'controller/files/__root__/__path__/__name__.js',
        'route': 'route/files/__root__/__path__/__name__.js',
        'service': 'service/files/__root__/__path__/__name__.js',
        'template': 'template/files/__root__/__path__/__name__.hbs',
        'helper': 'helper/files/__root__/helpers/__name__.js',
        'controller-test': 'controller-test/qunit-files/tests/unit/__path__/__test__.js',
        'route-test': 'route-test/qunit-files/tests/unit/__path__/__test__.js',
        'service-test': 'service-test/qunit-files/tests/unit/__path__/__test__.js',
        'component-test': 'component-test/qunit-files/tests/__testType__/__path__/__test__.js',
        'acceptance-test': 'acceptance-test/qunit-files/tests/acceptance/__name__-test.js'
      }
    }
  }

  for (let list in blueprintFiles) {
    let blueprintPath = blueprintFiles[list].path;
    let files = blueprintFiles[list].files;
    for (let blueprintName in files) {
      let filePath = blueprintPath + '/blueprints/' + files[blueprintName];
      fileMap[blueprintName] = fs.readFileSync(filePath).toString();
    }
  }

  // Location should be 'none' in router.js
  fileMap['router'] = fileMap['router'].replace(/config\.locationType/, "'none'");
  fileMap['twiddle.json'] = fs.readFileSync('blueprints/twiddle.json').toString();
  fileMap['initializers/router'] = fs.readFileSync('blueprints/router_initializer.js').toString();
  fileMap['initializers/mouse-events'] = fs.readFileSync('blueprints/mouse_events_initializer.js').toString();
  fileMap['controllers/application'] = fs.readFileSync('blueprints/application_controller.js').toString();
  fileMap['templates/application'] = fs.readFileSync('blueprints/application_template.hbs').toString();
  fileMap['app.css'] = fs.readFileSync('blueprints/app.css').toString();
  fileMap['index.html'] = fs.readFileSync('blueprints/index.html').toString();
  fileMap['test-helper'] = fs.readFileSync('blueprints/test-helper.js').toString();
  fileMap['test-start-app'] = fs.readFileSync('blueprints/start-app.js').toString();
  fileMap['model'] = fs.readFileSync('blueprints/model.js').toString();

  return 'export default ' + JSON.stringify(fileMap);
}

module.exports = getEmberCLIBlueprints;

