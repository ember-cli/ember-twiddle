import Ember from 'ember';
import config from '../config/environment';
import Settings from '../models/settings';

const { inject, run } = Ember;

export default Ember.Route.extend({
  notify: inject.service(),
  fastboot: inject.service(),
  toriiProvider: config.toriiProvider,

  beforeModel() {
    if (!this.get('fastboot.isFastBoot')) {
      run.schedule('afterRender', this, this.setupWindowUpdate);
    }
  },

  model() {
    let settings = Settings.create({
      isFastBoot: this.get('fastboot.isFastBoot')
    });

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
      this.get('router').updateTitle();
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
  },

  setupWindowUpdate() {
    // TODO: this in a controller seems suspect, rather this should likely be
    // part of some handshake, to ensure no races exist. This should likley not
    // be something a controller would handle - (SP)

    window.addEventListener('message', (m) => {
      run(() => {
        if(typeof m.data==='object' && 'setAppUrl' in m.data) {
          if (!this.get('isDestroyed')) {
            if (window.messagesWaiting > 0) {
              window.messagesWaiting = 0;
            }
            const newRoute = m.data.setAppUrl || '/';
            this.setProperties({
              applicationUrl: newRoute,
              route: newRoute === "/" ? undefined : newRoute
            });
          }
        }
      });
    });
  }
});
