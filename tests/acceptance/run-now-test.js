import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

module('Acceptance | run now', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('Able to reload the Twiddle', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: "{{input value='initial value' }}"
    }
  ];

  runGist(files);

  // turn off live reloading
  andThen(function() {
    find("#live-reload").click();
  });

  andThen(function() {
    assert.equal(outputPane().find('input').val(), 'initial value');

    outputPane().find('input').val('new value');

    assert.equal(outputPane().find('input').val(), 'new value');
  });

  andThen(function() {
    find(".run-now").click();
    waitForLoadedIFrame();
  });


  andThen(function() {
    assert.equal(outputPane().find('input').val(), 'initial value');
  });
});
