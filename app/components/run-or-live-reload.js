import Ember from "ember";

export default Ember.Component.extend({
  classNames: ['run-or-live-reload'],

  /**
   * Whether user wishes the code to automatically run
   * @type {boolean}
   */
  isLiveReload: true,

  liveReloadDidChange: Ember.observer('isLiveReload', function() {
    this.sendAction('liveReloadChanged', this.get('isLiveReload'));
  }),

  actions: {
    runNowClicked() {
      this.sendAction('runNow');
    }
  }
});
