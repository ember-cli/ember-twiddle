import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('main-gist', 'Unit | Component | main gist', {
  unit: true,
  needs: ['service:ember-cli']
});

test('isPathInvalid method', function(assert) {
  let controller = this.subject();

  window.alert = function() {};

  assert.ok(!controller.isPathInvalid('component', 'my-component'), 'can add component with valid pods path');
  assert.ok(controller.isPathInvalid('component', 'myComponent'), 'cannot add component with invalid pods path');
  assert.ok(!controller.isPathInvalid('component', 'some-route/my-component'), 'can add component with valid pods path');
  assert.ok(controller.isPathInvalid('component', 'some-route/mycomponent'), 'cannot add component with invalid pods path');
  assert.ok(!controller.isPathInvalid('component', 'components/my-component'), 'can add component with valid traditional path');
  assert.ok(controller.isPathInvalid('component', 'components/mycomponent'), 'cannot add component with invalid traditional path');

  assert.ok(!controller.isPathInvalid('component-js', 'my-component/component.js'), 'can add component with valid pods path');
  assert.ok(controller.isPathInvalid('component-js', 'myComponent/component.js'), 'cannot add component with invalid pods path');
  assert.ok(!controller.isPathInvalid('component-js', 'some-route/my-component/component.js'), 'can add component with valid pods path');
  assert.ok(controller.isPathInvalid('component-js', 'some-route/mycomponent/component.js'), 'cannot add component with invalid pods path');
  assert.ok(!controller.isPathInvalid('component-js', 'components/my-component.js'), 'can add component with valid traditional path');
  assert.ok(controller.isPathInvalid('component-js', 'components/mycomponent.js'), 'cannot add component with invalid traditional path');

  assert.ok(!controller.isPathInvalid('component-hbs', 'my-component/template.hbs'), 'can add component with valid pods path');
  assert.ok(controller.isPathInvalid('component-hbs', 'myComponent/template.hbs'), 'cannot add component with invalid pods path');
  assert.ok(!controller.isPathInvalid('component-hbs', 'some-route/my-component/template.hbs'), 'can add component with valid pods path');
  assert.ok(controller.isPathInvalid('component-hbs', 'some-route/mycomponent/template.hbs'), 'cannot add component with invalid pods path');
  assert.ok(!controller.isPathInvalid('component-hbs', 'templates/components/my-component.hbs'), 'can add component with valid traditional path');
  assert.ok(controller.isPathInvalid('component-hbs', 'templates/components/mycomponent.hbs'), 'cannot add component with invalid traditional path');
});
