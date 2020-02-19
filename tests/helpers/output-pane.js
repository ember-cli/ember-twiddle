import { find } from '@ember/test-helpers';

const iframe = "iframe#dummy-content-iframe";

export default function() {
  return find(iframe).contentWindow;
}