import Ember from 'ember';
import $ from 'jquery';

const {
  run
} = Ember;

export default Ember.Mixin.create({
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
