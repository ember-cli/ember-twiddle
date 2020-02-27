import Ember from 'ember';
import config from '../config/environment';

const { inject, computed } = Ember;

export default Ember.Component.extend({
  session: inject.service(),
  classNames: ['user-profile', 'layout-column'],
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
  }),

  actions: {
    signOut() {
      this.signOut();
    }
  }
});
