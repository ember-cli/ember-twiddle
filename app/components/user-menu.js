import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills', 'user-menu'],

  actions: {
    signInViaGithub() {
      this.sendAction('signInViaGithub');
    },
    signOut() {
      this.sendAction('signOut');
    }
  }
});
