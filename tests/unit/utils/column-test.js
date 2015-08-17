import Ember from "ember";
import Column from '../../../utils/column';
import { module, test } from 'qunit';

module('Unit | Utility | column');

test('Active Column matches', function(assert) {
  assert.expect(2);
  var controller = Ember.Object.create({
    activeEditorCol: '2',
    realNumColumns: 3
  });
  var column1 = Column.create({ col: '1', controller: controller });
  assert.ok(!column1.get('active'));
  var column2 = Column.create({ col: '2', controller: controller });
  assert.ok(column2.get('active'));
});

test('Show Column if less than or equal to realNumColumns', function(assert) {
  assert.expect(3);
  var controller = Ember.Object.create({
    activeEditorCol: '3',
    realNumColumns: 2
  });
  var column1 = Column.create({ col: '1', controller: controller });
  assert.ok(column1.get('show'));
  var column2 = Column.create({ col: '2', controller: controller });
  assert.ok(column2.get('show'));
  var column3 = Column.create({ col: '3', controller: controller });
  assert.ok(!column3.get('show'));
});
