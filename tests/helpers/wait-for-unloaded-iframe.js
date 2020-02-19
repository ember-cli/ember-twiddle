import Ember from 'ember';
import { settled, find } from '@ember/test-helpers';

const { Test } = Ember;

function hasNoIframe() {
  return find('iframe').length > 0;
}

export default async function(app) {
  let ctx = { app };
  Test.registerWaiter(ctx, hasNoIframe);

  await settled();
  Test.unregisterWaiter(ctx, hasNoIframe);
}
