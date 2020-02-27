import Ember from 'ember';
import { settled, find } from '@ember/test-helpers';

const { Test } = Ember;

function hasNoIframe() {
  return find('iframe').length > 0;
}

export default async function() {
  Test.registerWaiter(this, hasNoIframe);

  await settled();
  Test.unregisterWaiter(this, hasNoIframe);
}
