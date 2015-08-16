import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['input-edit'],
  classNameBindings: ['active'],

  //proxy clicks to input focus
  click() {
    this.$('input').focus();
  },

  enter() {
    this.$('input').blur();
  },

  actions: {
    inputFocusIn() {
      if(this.$('input').val()){
        this.$('input').val('');
    }

      this.set('active', true);
    },

    inputFocusOut() {      
      if(this.$('input').val()===''){
        this.$('input').val('New Twiddle');
      }

      this.set('active', false);
    },

    removeFocus() {
      this.$('input').blur();
      this.sendAction('inputFocusOut');
    }
  }

});
