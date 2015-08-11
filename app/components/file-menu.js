import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['dropdown'],

  actions: {
    addFile(type) {
      this.attrs.addFile(type);
    },
    renameFile(file) {
      this.attrs.renameFile(file);
    },
    removeFile(file) {
      this.attrs.removeFile(file);
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
      this.attrs.deleteGist(model);
    },
    signInViaGithub() {
      this.sendAction('signInViaGithub');
    }
  }
});
