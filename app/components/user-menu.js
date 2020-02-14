import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import config from '../config/environment';

export default Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills', 'user-menu'],

  userName: readOnly('session.currentUser.login'),

  version: config.APP.version,
  environment: config.environment,
  currentRevision: config.currentRevision,

  v: computed('version', function() {
    return this.version.charAt(0) === "v" ? "" : "v";
  }),

  currentVersionLink: computed('environment', 'v', 'version', 'currentRevision', function() {
    var baseLink = "https://github.com/ember-cli/ember-twiddle";
    var { environment, currentRevision, v, version } = this;
    var tagName = `${v}${version}`;

    switch (environment) {
      case 'production':
        return `${baseLink}/releases/tag/${tagName}`;

      case 'staging':
        return `${baseLink}/commit/${currentRevision}`;
    }
    return '';
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
