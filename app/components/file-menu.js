import Ember from 'ember';
import DropdownSubmenuFixMixin from '../mixins/dropdown-submenu-fix';

const { computed } = Ember;

export default Ember.Component.extend(DropdownSubmenuFixMixin, {
  // show fork option only if does not belong to user and is not a revision, otherwise show copy
  // Github api does not permit forking if you own the gist already
  // Github does not provide api for forking a revision
  showFork: computed('model.ownerLogin', 'session.currentUser.login', 'isRevision', function() {
    return !this.get('isRevision') && this.get('model.ownerLogin') !== this.get('session.currentUser.login');
  }),

  actions: {
    addComponent() {
      this.addComponent();
    },
    addHelper() {
      this.addHelper();
    },
    addFile(type) {
      this.addFile(type);
    },
    addUnitTestFile(type) {
      this.addUnitTestFile(type);
    },
    addIntegrationTestFile(type) {
      this.addIntegrationTestFile(type);
    },
    addAcceptanceTestFile() {
      this.addAcceptanceTestFile();
    },
    renameFile(file) {
      this.renameFile(file);
    },
    removeFile(file) {
      this.removeFile(file);
    },
    saveGist(model) {
      this.saveGist(model);
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
      this.fork(model);
    },
    copy() {
      this.copy();
    },
    deleteGist(model) {
      this.deleteGist(model);
    },
    signInViaGithub() {
      this.signInViaGithub();
    },
    showRevision(id) {
      this.showRevision(id);
    },
    showCurrentVersion() {
      this.showCurrentVersion();
    },
    downloadProject() {
      this.downloadProject();
    }
  }
});
