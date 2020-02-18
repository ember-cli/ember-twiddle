import Ember from 'ember';
import RSVP from 'rsvp';
import { settled } from '@ember/test-helpers';

const { Test, run } = Ember;

function hasNoIframe() {
  return this.app.testHelpers.find('iframe').length > 0;
}

export default async function(app) {
  let ctx = { app };
  Test.registerWaiter(ctx, hasNoIframe);

  await settled();
  Test.unregisterWaiter(ctx, hasNoIframe);
}
