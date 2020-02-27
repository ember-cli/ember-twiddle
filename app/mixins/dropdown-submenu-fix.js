import Mixin from '@ember/object/mixin';
import { on } from '@ember/object/evented';
import $ from 'jquery';

export default Mixin.create({

  addDropdownListener: on('didInsertElement', function() {
    this.$('[data-toggle=dropdown]').on('click', this.dropdownToggleClick);
  }),

  removeDropdownListener: on('willDestroyElement', function() {
    this.$('[data-toggle=dropdown]').off('click', this.dropdownToggleClick);
  }),

  // Fix for dropdown submenu opening on hover, not click
  dropdownToggleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).parent().siblings().removeClass('open');
    $(this).parent().toggleClass('open');
  }
});
