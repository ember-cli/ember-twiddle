import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:twiddle-json', 'Unit | Service | twiddle json', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  needs: ["service:dependency-resolver", "service:notify"]
});

test("getTwiddleJson() resolves dependencies", function(assert) {
  let done = assert.async();
  var service = this.subject();

  var gist = EmberObject.create({
    files: A([EmberObject.create({
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

  service.getTwiddleJson(gist).then(twiddleJson => {
    assert.deepEqual(twiddleJson.dependencies, {
      'ember': "//cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.9/ember.debug.js",
      'ember-template-compiler': "//cdnjs.cloudflare.com/ajax/libs/ember.js/2.0.1/ember-template-compiler.js",
      'ember-testing': "//cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.9/ember-testing.js",
      'ember-data': "//cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.12.1/ember-data.js",
      'jquery': "//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js"
    });
    done();
  });
});

test("updateDependencyVersion() updates the version of the dependency in twiddle.json", function(assert) {
  assert.expect(2);

  let done = assert.async();
  var service = this.subject();

  var gist = EmberObject.create({
    files: A([EmberObject.create({
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
    done();
  });
});

test("updateDependencyVersion() updates the version of ember-template-compiler if ember is updated", function(assert) {
  assert.expect(2);

  let done = assert.async();
  var service = this.subject();

  var gist = EmberObject.create({
    files: A([EmberObject.create({
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
    done();
  });
});

test("updateDependencyVersion() updates the version of ember-testing if ember is updated", function(assert) {
  assert.expect(2);

  let done = assert.async();
  var service = this.subject();

  var gist = EmberObject.create({
    files: A([EmberObject.create({
      filePath: 'twiddle.json',
      content: `
        {
          "dependencies": {
            "ember": "1.13.9",
            "ember-testing": "1.13.9"
          }
        }
      `
    })])
  });

  service.updateDependencyVersion(gist, 'ember', 'release').then(function() {
    var updatedContent = gist.get('files').findBy('filePath', 'twiddle.json').get('content');
    var parsed = JSON.parse(updatedContent);

    assert.equal(parsed.dependencies.ember, 'release');
    assert.equal(parsed.dependencies['ember-testing'], 'release');
    done();
  });
});
