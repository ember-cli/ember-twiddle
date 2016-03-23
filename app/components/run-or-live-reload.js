import Ember from "ember";

export default Ember.Component.extend({
  classNames: ['run-or-live-reload'],

  /**
   * Whether user wishes the code to automatically run
   * @type {boolean}
   */
  isLiveReload: true,

  actions: {
    runNowClicked() {
      this.attrs.runNow();
    },

    liveReloadClicked(checked) {
      this.attrs.liveReloadChanged(checked);
    }
  }
});
