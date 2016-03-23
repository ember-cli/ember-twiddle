import Ember from 'ember';
import config from '../config/environment';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills', 'user-menu'],

  userName: computed.readOnly('session.currentUser.login'),

  version: config.APP.version,
  environment: config.environment,
  currentRevision: config.currentRevision,

  v: computed('version', function() {
    return this.get('version').charAt(0) === "v" ? "" : "v";
  }),

  currentVersionLink: computed('environment', 'version', 'currentRevision', function() {
    var baseLink = "https://github.com/ember-cli/ember-twiddle";
    var { environment, currentRevision, version } = this.getProperties('environment', 'currentRevision', 'version');

    switch (environment) {
      case 'production':
        return `${baseLink}/releases/tag/${version}`;

      case 'staging':
        return `${baseLink}/commit/${currentRevision}`;
    }
  }),

  actions: {
    signInViaGithub() {
      this.attrs.signInViaGithub();
    },
    signOut() {
      this.attrs.signOut();
    },

    showTwiddles() {
      this.attrs.showTwiddles();
    }
  }
});
