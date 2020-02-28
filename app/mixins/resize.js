import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';
import $ from 'jquery';

export default Mixin.create({
  didInsertElement() {
    this._super();
    this.boundResizeHandler = this.resizeHandler.bind(this);
    $(window).on('resize', this.boundResizeHandler);
  },

  willDestroyElement() {
    this._super();
    $(window).off('resize', this.boundResizeHandler);
  },

  resizeHandler() {
    return run.bind(() => this.didResize());
  }
});
