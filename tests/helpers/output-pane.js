import { find } from '@ember/test-helpers';

const iframe = "iframe#dummy-content-iframe";

export default async function() {
  return find(iframe)[0].contentWindow;
}