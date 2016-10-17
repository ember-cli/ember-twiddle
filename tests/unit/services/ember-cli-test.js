import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('service:ember-cli', 'Unit | Service | ember cli', {
  // Specify the other units that are required for this test.
  needs: [
    'model:gist',
    'model:gistFile',
    'service:dependency-resolver',
    'service:twiddle-json',
    'service:notify'
  ]
});

test('compiling a gist works', function(assert) {
  assert.expect(7);
  var service = this.subject();
  assert.ok(service);

  var gist = Ember.Object.create({
    files: Ember.A([
      Ember.Object.create({
        filePath: 'templates/application.hbs',
        extension: '.hbs',
        content: '<h1>Hi, I\'m{{appName}}</h1>'
      }),
      Ember.Object.create({
        filePath: 'controllers/application.js',
        extension: '.js',
        content: 'import Ember from "ember";\n\nexport default Ember.Controller.extend({appName:"foo"});'
      })
    ])
  });

  Ember.run(function() {
    service.compileGist(gist).then(function(output) {
      output = output.replace(/define\('([a-z0-9\-\/]+)'/gi,'define("$1"');
      assert.ok(output.indexOf('define("twiddle/router"')>-1, 'build contains router');
      assert.ok(output.indexOf('define("twiddle/initializers/router"')>-1, 'build contains router initializer');
      assert.ok(output.indexOf('define("twiddle/app"')>-1, 'build contains app');
      assert.ok(output.indexOf('define("twiddle/templates/application"')>-1, 'build contains template');
      assert.ok(output.indexOf('define("twiddle/controllers/application"')>-1, 'build contains controller');
      assert.ok(output.indexOf('define("twiddle/config/environment"')>-1, 'build contains config');
    });
  });
});

test("buildProperties() works as expected without replacements", function (assert) {
  assert.expect(3);

  var service = this.subject();
  var props = service.buildProperties('helper');

  assert.equal(props.filePath, 'helpers/my-helper.js', 'filePath set');
  assert.ok(props.content, 'has content');
  assert.ok(props.content.indexOf('<%=') === -1, 'No replacement tags in content');
});

test("buildProperties() works as expected with replacements", function (assert) {
  assert.expect(5);

  var service = this.subject();
  var props = service.buildProperties('helper', {
    camelizedModuleName: 'myHelper'
  });

  assert.equal(props.filePath, 'helpers/my-helper.js', 'filePath set');
  assert.ok(props.content, 'has content');
  assert.ok(props.content.indexOf('<%=') === -1, 'No replacement tags in content');
  assert.ok(props.content.indexOf('myHelper(params') !== -1, 'Replacements worked');
  assert.ok(props.content.indexOf('helper(myHelper)') !== -1, 'Replacements worked if multiple');
});

test('compileHbs includes moduleName', function(assert) {
  var service = this.subject();
  var result = service.compileHbs('foo', 'somePath/here.hbs');

  assert.ok(result.indexOf('moduleName: "twiddle/somePath/here"') > -1, 'moduleName included');
});

test('compileHbs can include backticks', function(assert) {
  var template = "`stuff`";
  var service = this.subject();
  var result = service.compileHbs(template, 'some-path');

  assert.ok(result.indexOf(template) > -1, 'original template included');
});

test("buildHtml works when testing not enabled", function(assert) {
  var service = this.subject();

  var twiddleJson = {
    "version": "0.5.0",
    "EmberENV": {
      "FEATURES": {}
    },
    "options": {
      "enable-testing": false
    },
    "dependencies": {
      "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js"
    }
  };

  var gist = Ember.Object.create({
    initialRoute: "/"
  });

  var output = service.buildHtml(gist, '/* app */', '/* styles */', twiddleJson);

  assert.ok(output.indexOf("window.location.hash='/';") > 0, "output sets initialRoute");
  assert.ok(output.indexOf('EmberENV = {"FEATURES":{}}') > 0, "output contains feature flags");
  assert.ok(output.indexOf('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js"></script>') > 0, "output includes dependency");
  assert.ok(output.indexOf('<style type="text/css">/* styles */') > 0, "output includes styles");
  assert.ok(output.indexOf('<script type="text/javascript">/* app */') > 0, "output includes the app js");
  assert.ok(output.indexOf('<div id="ember-testing-container">') === -1, "output does not contain testing container");
});



test("buildHtml works when testing is enabled", function(assert) {
  var service = this.subject();

  var twiddleJson = {
    "version": "0.5.0",
    "EmberENV": {
      "FEATURES": {}
    },
    "options": {
      "enable-testing": true
    },
    "dependencies": {
      "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js"
    }
  };

  var gist = Ember.Object.create({});

  var output = service.buildHtml(gist, '', '', twiddleJson);

  assert.ok(output.indexOf("window.location.hash='/';") === -1, "output does not set initialRoute if not provided");
  assert.ok(output.indexOf('<div id="qunit"></div>') > 0, "output contains qunit div");
  assert.ok(output.indexOf('<div id="qunit-fixture"></div>') > 0, "output contains qunit fixture div");
  assert.ok(output.indexOf('<div id="ember-testing-container">') > 0, "output contains testing container");
  assert.ok(output.indexOf('<div id="ember-testing"></div>') > 0, "output contains testing div");
});

test("fixTwiddleAppNames works", function(assert) {
  var service = this.subject();

  assert.equal(service.fixTwiddleAppNames("import a from 'app/b';"), "import a from 'twiddle/b';");
  assert.equal(service.fixTwiddleAppNames('import ab from "demo-app/bc";'), 'import ab from "twiddle/bc";');
  assert.equal(service.fixTwiddleAppNames('import {a, b} from "demo-app/c.js";'), 'import {a, b} from "twiddle/c.js";');
  assert.equal(service.fixTwiddleAppNames("import a, {b, c} from 'demo-app/d';"), "import a, {b, c} from 'twiddle/d';");
  assert.equal(service.fixTwiddleAppNames("import {bc, cd}, ab from 'demo-app/de';"), "import {bc, cd}, ab from 'twiddle/de';");
  assert.equal(service.fixTwiddleAppNames(`import {
  a,
  b,
  c
} from 'demo-app/utils';`), `import {
  a,
  b,
  c
} from 'twiddle/utils';`);
});
