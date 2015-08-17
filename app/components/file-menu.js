import Ember from "ember";

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['dropdown'],

  belongsToUser: computed('model.ownerLogin', 'session.currentUser.login', function() {
    return this.get('model.ownerLogin') === this.get('session.currentUser.login');
  }),

  actions: {
    addComponent() {
      this.attrs.addComponent();
    },
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
    embed() {
      let src = window.location.href.split("?")[0];
      src += "?numColumns=0";
      let embedCode = `<iframe width="800" height="600" src="${src}"></iframe>`;
      prompt('Ctrl + C ;-)', embedCode);
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
