import Ember from "ember";
import config from '../config/environment';

export default Ember.Route.extend({
  toriiProvider: config.toriiProvider,

  title(tokens) {
    return "Ember Twiddle - " + tokens.join(" - ");
  },

  actions: {
    titleUpdated() {
      this.get('router').updateTitle();
    },

    signInViaGithub () {
      this.session.open(this.get('toriiProvider')).catch(function(error) {
        if (alert) {
          alert('Could not sign you in: ' + error.message);
        }
        throw error;
      });
    },

    signOut () {
      this.session.close();
    }
  }
});
