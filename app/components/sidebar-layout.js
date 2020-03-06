import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class SidebarLayoutComponent extends Component {
  @tracked isOpen = true;
  @tracked isSidebarOpen = true;
}
