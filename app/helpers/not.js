import { helper } from '@ember/component/helper';

export default helper(function not([val]/*, hash*/) {
  return !val;
});
