import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['input-edit'],
  classNameBindings: ['active'],

  //proxy clicks to input focus
  click() {
    this.$('input').focus();
  },

  actions: {
    inputFocusIn() {
      this.set('active', true);
    },

    inputFocusOut() {
      this.set('active', false);
    }
  }

});
