import Ember from 'ember';
import DropdownSubmenuFixMixin from "../mixins/dropdown-submenu-fix";

const { computed, inject } = Ember;

export default Ember.Component.extend(DropdownSubmenuFixMixin, {
  dependencyResolver: inject.service(),
  tagName: 'li',
  classNames: ['dropdown', 'versions-menu'],

  versions: computed.readOnly('dependencyResolver.emberVersions'),
  dataVersions: computed.readOnly('dependencyResolver.emberDataVersions')
});
