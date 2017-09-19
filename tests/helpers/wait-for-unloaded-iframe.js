import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

const { Test } = Ember;

function hasNoIframe() {
  return this.app.testHelpers.find('iframe').length > 0;
}

export default function(app) {
  let ctx = { app };
  Test.registerWaiter(ctx, hasNoIframe);

  return wait().then(() => {
    Test.unregisterWaiter(ctx, hasNoIframe);
  });
}