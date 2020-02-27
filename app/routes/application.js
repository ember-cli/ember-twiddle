import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from '../config/environment';
import Settings from '../models/settings';


export default Route.extend({
  notify: service(),
  toriiProvider: config.toriiProvider,

  model() {
    let settings = Settings.create();

    return {
      settings
    };
  },

  setupController(controller, resolved) {
    controller.setProperties(resolved);
  },

  title(tokens) {
    return 'Ember Twiddle - ' + tokens.join(' - ');
  },

  actions: {
    showTwiddles() {
      this.transitionTo('twiddles');
    },

    titleUpdated() {
      this._router.updateTitle();
    },

    setEditorKeyMap(keyMap) {
      const settings = this.get('controller.settings');
      settings.set('keyMap', keyMap);
      settings.save();
    },

    signInViaGithub () {
      let notify = this.get('notify');

      this.session.open(this.get('toriiProvider')).catch((error) => {
        notify.warning('Could not sign you in: ' + error.message);
        throw error;
      });
    },

    signOut () {
      this.session.close();
    },

    transitionTo() {
      let args = [].slice.call(arguments, 0);

      if (args[args.length - 1] instanceof Ember.$.Event) {
        args = args.slice(0, -1);
      }

      return this.transitionTo(...args);
    }
  }
});
