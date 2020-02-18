import Ember from 'ember';
import { settled } from '@ember/test-helpers';

const { Test } = Ember;

function hasNoIframe() {
  return this.app.testHelpers.find('iframe').length > 0;
}

export default async function(app) {
  let ctx = { app };
  Test.registerWaiter(ctx, hasNoIframe);

  await settled();
  Test.unregisterWaiter(ctx, hasNoIframe);
}
