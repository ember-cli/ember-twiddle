import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default Component.extend({
  classNames: ['gist-body'],
  noColumns: equal('numColumns', 0)
});
