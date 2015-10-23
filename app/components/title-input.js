import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['input-edit'],
  classNameBindings: ['active'],

  //proxy clicks to input focus
  click() {
    this.$('input').focusin();
  },

  change() {
    this.send('valueChanged');
  },

  actions: {
    inputFocusIn(){

      //only if not already focused so subset of the value can still be selected manually
      if(!this.get('active')){
        this.$('input').select().one('mouseup.selectValue',
          function (e) {
            e.preventDefault();
          }
        );
      }

      this.set('active', true);
    },

    inputFocusOut(){
      if(this.$('input').val()===''){
        this.$('input').val('New Twiddle');
      }

      this.set('active', false);
    },

    removeFocus() {
      this.$('input').blur();
    },

    valueChanged() {
      this.attrs.titleChanged();
    }
  }

});
