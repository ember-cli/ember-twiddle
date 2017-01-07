import Ember from 'ember';
import DropdownSubmenuFixMixin from "../mixins/dropdown-submenu-fix";

const { computed, inject } = Ember;

export default Ember.Component.extend(DropdownSubmenuFixMixin, {
  dependencyResolver: inject.service(),
  classNames: ['versions-menu'],

  versions: computed.readOnly('dependencyResolver.emberVersions'),
  dataVersions: computed.readOnly('dependencyResolver.emberDataVersions')
});
