import Ember from "ember";

const { inject, RSVP, run } = Ember;

export default Ember.Controller.extend({
  fastboot: inject.service(),

  queryParams: ['numColumns', 'fullScreen', 'route', 'openFiles', 'fileTreeShown'],
  numColumns: 1,
  fullScreen: false,
  openFiles: "",
  fileTreeShown: true,
  route: undefined,
  applicationUrl: undefined,
  unsaved: true,

  init(...args) {
    this._super(...args);
    if (!this.get('fastboot.isFastBoot')) {
      this.setupWindowUpdate();
    }
  },

  actions: {
    transitionQueryParams(queryParams) {
      return this.transitionToRoute({ queryParams: queryParams }).then(() => {
        return RSVP.resolve(queryParams);
      });
    }
  },

  setupWindowUpdate: function() {
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
