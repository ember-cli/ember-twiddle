import { equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  noColumns: equal('numColumns', 0)
});
