import Ember from 'ember';
import DropdownSubmenuFixMixin from "../mixins/dropdown-submenu-fix";

export default Ember.Component.extend(DropdownSubmenuFixMixin, {
  tagName: 'li',
  classNames: ['dropdown', 'versions-menu']
});
