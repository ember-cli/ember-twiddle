import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('service:ember-cli', 'Unit | Service | ember cli', {
  // Specify the other units that are required for this test.
  needs: ['model:gist','model:gistFile', 'service:dependency-resolver']
});

// Replace this with your real tests.
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
      assert.ok(output.indexOf('define("demo-app/router"')>-1, 'build contains router');
      assert.ok(output.indexOf('define("demo-app/initializers/router"')>-1, 'build contains router initializer');
      assert.ok(output.indexOf('define("demo-app/app"')>-1, 'build contains app');
      assert.ok(output.indexOf('define("demo-app/templates/application"')>-1, 'build contains template');
      assert.ok(output.indexOf('define("demo-app/controllers/application"')>-1, 'build contains controller');
      assert.ok(output.indexOf('define("demo-app/config/environment"')>-1, 'build contains config');
    });
  });
});

test("getTwiddleJson() resolves dependencies", function(assert) {
  var service = this.subject();

  var gist = Ember.Object.create({
    files: Ember.A([Ember.Object.create({
      filePath: 'twiddle.json',
      content: `
        {
          "dependencies": {
            "ember": "1.13.9",
            "ember-template-compiler": "2.0.1",
            "ember-data": "1.12.1",
            "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js"
          }
        }
      `
    })])
  });

  var twiddleJson = service.getTwiddleJson(gist);

  assert.deepEqual(twiddleJson.dependencies, {
    'ember': "//cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.9/ember.debug.js",
    'ember-template-compiler': "//cdnjs.cloudflare.com/ajax/libs/ember.js/2.0.1/ember-template-compiler.js",
    'ember-data': "//cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.12.1/ember-data.js",
    'jquery': "//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js"
  });
});

test("updateDependencyVersion() updates the version of the dependency in twiddle.json", function(assert) {
  assert.expect(2);

  var service = this.subject();

  var gist = Ember.Object.create({
    files: Ember.A([Ember.Object.create({
      filePath: 'twiddle.json',
      content: `
        {
          "dependencies": {
            "ember": "1.13.9"
          }
        }
      `
    })])
  });

  service.updateDependencyVersion(gist, 'ember', 'release').then(function() {
    var updatedContent = gist.get('files').findBy('filePath', 'twiddle.json').get('content');
    var parsed = JSON.parse(updatedContent);

    assert.equal(parsed.dependencies.ember, 'release');
    assert.equal(parsed.dependencies.hasOwnProperty('ember-template-compiler'), false, "does not automatically add an ember-template-compiler dependency, when ember is updated");
  });
});

test("updateDependencyVersion() updates the version of ember-template-compiler if ember is updated", function(assert) {
  assert.expect(2);

  var service = this.subject();

  var gist = Ember.Object.create({
    files: Ember.A([Ember.Object.create({
      filePath: 'twiddle.json',
      content: `
        {
          "dependencies": {
            "ember": "1.13.9",
            "ember-template-compiler": "1.13.9"
          }
        }
      `
    })])
  });

  service.updateDependencyVersion(gist, 'ember', 'release').then(function() {
    var updatedContent = gist.get('files').findBy('filePath', 'twiddle.json').get('content');
    var parsed = JSON.parse(updatedContent);

    assert.equal(parsed.dependencies.ember, 'release');
    assert.equal(parsed.dependencies['ember-template-compiler'], 'release');
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
