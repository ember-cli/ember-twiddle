import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
import RSVP from 'rsvp';

const { Test, run } = Ember;

function hasNoIframe() {
  return this.app.testHelpers.find('iframe').length > 0;
}

export default function(app) {
  let ctx = { app };
  Test.registerWaiter(ctx, hasNoIframe);

  return wait().then(() => {
    Test.unregisterWaiter(ctx, hasNoIframe);
    return RSVP.resolve();
  }).then(() => {
    return new RSVP.Promise(function (resolve) {
      run.later(resolve, 10);
    });
  });
}
