export default Ember.Component.extend({
  classNames: ['run-or-live-reload'],

  /**
   * Whether user wishes the code to automatically run
   * @type {boolean}
   */
  isLiveReload: true,

  liveReloadDidChange: function() {
    this.sendAction('liveReloadChanged', this.get('isLiveReload'));
  }.observes('isLiveReload'),

  actions: {
    runNowClicked() {
      this.sendAction('runNow');
    }
  }
});
