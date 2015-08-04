import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills', 'file-menu'],

  actions: {
    addFile(type) {
      this.sendAction('addFile', type);
    },
    renameFile(file) {
      this.sendAction('renameFile', file);
    },
    removeFile(file) {
      this.sendAction('removeFile', file);
    },
    saveGist(model) {
      this.sendAction('saveGist', model);
    },
    share() {
      prompt('Ctrl + C ;-)', window.location.href);
    },
    fork(model) {
      this.sendAction('fork', model);
    },
    deleteGist(model) {
      this.sendAction('deleteGist', model);
    },
    signInViaGithub() {
      console.log('here');
      this.sendAction('signInViaGithub');
    }
  }
});
