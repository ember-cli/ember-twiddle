import Ember from 'ember';

export default Ember.Component.extend({
  keyMap: 'Default',

  init() {
    this._super(...arguments);

    this.modes = [
      { id: 'default', label: 'Default' },
      { id: 'basic', label: 'Basic' },
      { id: 'vim', label: 'Vim' },
      { id: 'emacs', label: 'Emacs' },
      { id: 'sublime', label: 'Sublime' }
    ];
  },

  actions: {
    setKeyMap(keyMap) {
      let modes = this.get('modes');
      let mode = modes.findBy('id', keyMap);

      if (mode) {
        this.set('keyMap', mode.label);
      }

      this.get('setKeyMap')(keyMap);
    }
  }
});
