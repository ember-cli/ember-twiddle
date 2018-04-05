import Ember from 'ember';
import $ from 'jquery';

const {
  computed,
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

  resizeHandler: computed(function() {
    return run.bind(this, 'didResize');
  })
});
