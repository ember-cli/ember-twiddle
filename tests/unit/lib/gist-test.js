import {
  module,
  test
} from 'qunit';

import gistFixtures from '../../fixtures/gist';
import Gist from '../../../lib/gist';

module('Gist model');

test('it exists', function(assert) {
  var model = Gist.create({});

  assert.ok(!!model);
});

test('deserialize works', function(assert) {
  var gist = Gist.deserialize(gistFixtures['f2c90713bdfdf54a262b']);
  var fileContent = gistFixtures['f2c90713bdfdf54a262b'].files['controllers.application.js'].content;
  assert.ok(gist instanceof Gist, 'deserializeGist should return a Gist instance');
  assert.equal(gist.get('files.length'), 4, 'Gist contains 4 files');
  assert.equal(gist.get('files.firstObject.name'), 'controllers/application.js', 'File name is properly deserialized');
  assert.equal(gist.get('files.firstObject.content'), fileContent, 'File content is properly deserialized');
});
