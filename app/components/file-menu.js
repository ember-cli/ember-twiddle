import Ember from "ember";
import DropdownSubmenuFixMixin from "../mixins/dropdown-submenu-fix";

const { computed } = Ember;

export default Ember.Component.extend(DropdownSubmenuFixMixin, {
  tagName: 'li',
  classNames: ['dropdown'],

  // show fork option only if does not belong to user and is not a revision, otherwise show copy
  // Github api does not permit forking if you own the gist already
  // Github does not provide api for forking a revision
  showFork: computed('model.ownerLogin', 'session.currentUser.login', 'isRevision', function() {
    return !this.get('isRevision') && this.get('model.ownerLogin') !== this.get('session.currentUser.login');
  }),

  actions: {
    addComponent() {
      this.attrs.addComponent();
    },
    addHelper() {
      this.attrs.addHelper();
    },
    addFile(type) {
      this.attrs.addFile(type);
    },
    addUnitTestFile(type) {
      this.attrs.addUnitTestFile(type);
    },
    addIntegrationTestFile(type) {
      this.attrs.addIntegrationTestFile(type);
    },
    addAcceptanceTestFile() {
      this.attrs.addAcceptanceTestFile();
    },
    renameFile(file) {
      this.attrs.renameFile(file);
    },
    removeFile(file) {
      this.attrs.removeFile(file);
    },
    saveGist(model) {
      this.attrs.saveGist(model);
    },
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
    },
    fork(model) {
      this.attrs.fork(model);
    },
    copy() {
      this.attrs.copy();
    },
    deleteGist(model) {
      this.attrs.deleteGist(model);
    },
    signInViaGithub() {
      this.attrs.signInViaGithub();
    },
    showRevision(id) {
      this.attrs.showRevision(id);
    },
    showCurrentVersion() {
      this.attrs.showCurrentVersion();
    }
  }
});
