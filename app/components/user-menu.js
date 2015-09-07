import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills', 'user-menu'],

  userName: Ember.computed.alias('session.currentUser.login'),

  actions: {
    signInViaGithub() {
      this.sendAction('signInViaGithub');
    },
    signOut() {
      this.sendAction('signOut');
    }
  }
});
