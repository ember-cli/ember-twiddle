import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';
import $ from 'jquery';

export default Mixin.create({
  didInsertElement() {
    this._super();
    $(window).on('resize', this.get("resizeHandler"));
  },

  willDestroyElement() {
    this._super();
    $(window).off('resize', this.get("resizeHandler"));
  },

  resizeHandler() {
    return run.bind(this, 'didResize');
  }
});
