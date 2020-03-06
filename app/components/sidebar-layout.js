import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SidebarLayoutComponent extends Component {
  @tracked isOpen = true;
  @tracked isSidebarOpen = this.args.isSidebarOpen;

  @action
  updateSidebar(isOpen) {
    this.args.onSidebarUpdated(isOpen);
  }
}
