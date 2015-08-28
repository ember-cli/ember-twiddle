import Ember from "ember";
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:gist', {
  needs: ['service:ember-cli'],

  beforeEach() {
    this._originalConfirm = window.confirm;
  },

  afterEach() {
    window.confirm = this._originalConfirm;
  }
});

test('deleting a gist requires confirmation', function(assert) {
  let controller = this.subject({
    transitionToRoute() {},
    notify: {
      info() {}
    }
  });
  let gistClass = Ember.Object.extend({
    called: false,
    destroyRecord() {
      this.set('called', true);
    }
  });

  window.confirm = () => true;
  let gist = gistClass.create();
  controller.send('deleteGist', gist);
  assert.ok(gist.get('called'), 'gist.destroyRecord was called when confirmed');

  window.confirm = () => false;
  gist = gistClass.create();
  controller.send('deleteGist', gist);
  assert.ok(!gist.get('called'), 'gist.destroyRecord was not called when not confirmed');
});

test('isPathInvalid method', function(assert) {
  let controller = this.subject();

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
