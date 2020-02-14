import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  classNames: ['input-edit'],
  classNameBindings: ['active'],

  //proxy clicks to input focus
  click() {
    $(this.element).find('input').focusin();
  },

  change() {
    this.send('valueChanged');
  },

  actions: {
    inputFocusIn() {

      //only if not already focused so subset of the value can still be selected manually
      if(!this.active){
        $(this.element).find('input').select().one('mouseup.selectValue',
          function (e) {
            e.preventDefault();
          }
        );
      }

      this.set('active', true);
    },

    inputFocusOut() {
      if( $(this.element).find('input').val()===''){
        $(this.element).find('input').val('New Twiddle');
      }

      this.set('active', false);
    },

    removeFocus() {
      $(this.element).find('input').blur();
    },

    valueChanged() {
      this.titleChanged();
    }
  }

});
