import Ember from 'ember';
import config from '../config/environment';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['user-menu', 'layout-column'],

  userName: computed.readOnly('session.currentUser.login'),

  version: config.APP.version,
  environment: config.environment,
  currentRevision: config.currentRevision,

  v: computed('version', function() {
    return this.get('version').charAt(0) === "v" ? "" : "v";
  }),

  currentVersionLink: computed('environment', 'v', 'version', 'currentRevision', function() {
    var baseLink = "https://github.com/ember-cli/ember-twiddle";
    var { environment, currentRevision, v, version } = this.getProperties('environment', 'currentRevision', 'v', 'version');
    var tagName = `${v}${version}`;

    switch (environment) {
      case 'production':
        return `${baseLink}/releases/tag/${tagName}`;

      case 'staging':
        return `${baseLink}/commit/${currentRevision}`;
    }
  }),

  actions: {
    signInViaGithub() {
      this.signInViaGithub();
    },
    signOut() {
      this.signOut();
    },

    showTwiddles() {
      this.showTwiddles();
    }
  }
});
