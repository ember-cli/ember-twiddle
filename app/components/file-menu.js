import Component from '@ember/component';
import { computed } from '@ember/object';
import DropdownSubmenuFixMixin from "../mixins/dropdown-submenu-fix";

export default Component.extend(DropdownSubmenuFixMixin, {
  classNames: ['file-menu', 'dropdown'],

  // show fork option only if does not belong to user and is not a revision, otherwise show copy
  // Github api does not permit forking if you own the gist already
  // Github does not provide api for forking a revision
  showFork: computed('model.ownerLogin', 'session.currentUser.login', 'isRevision', function() {
    return !this.isRevision && this.get('model.ownerLogin') !== this.get('session.currentUser.login');
  }),

  actions: {
    share() {
      prompt('Ctrl + C ;-)', window.location.href);
    },
    embed() {
      let src = window.location.href.split('?')[0];
      src += '?fullScreen=true';
      let responsive = document.createElement('div');
      responsive.style.cssText = 'position:relative;height:0;overflow:hidden;max-width:100%;padding-bottom:56.25%;'; // 16:9
      let iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
      responsive.appendChild(iframe);
      let embedCode = responsive.outerHTML;
      prompt('Ctrl + C ;-)', embedCode);
    }
  }
});
