import Component from '@ember/component';

export default Component.extend({
  classNames: ['run-or-live-reload'],

  /**
   * Whether user wishes the code to automatically run
   * @type {boolean}
   */
  isLiveReload: true,

  actions: {
    runNowClicked() {
      this.runNow();
    },

    liveReloadClicked(checked) {
      this.liveReloadChanged(checked);
    }
  }
});
