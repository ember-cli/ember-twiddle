import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('service:ember-cli', 'Unit | Service | ember cli', {
  // Specify the other units that are required for this test.
  needs: ['model:gist','model:gistFile']
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
