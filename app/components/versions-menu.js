import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import DropdownSubmenuFixMixin from "../mixins/dropdown-submenu-fix";

export default Component.extend(DropdownSubmenuFixMixin, {
  dependencyResolver: service(),
  tagName: 'li',
  classNames: ['dropdown', 'versions-menu'],

  versions: readOnly('dependencyResolver.emberVersions'),
  dataVersions: readOnly('dependencyResolver.emberDataVersions')
});
