import Ember from 'ember';

export default Ember.Component.extend({
  modes: [
    { id: 'basic', label: 'Basic' },
    { id: 'vim', label: 'Vim' },
    { id: 'emacs', label: 'Emacs' },
    { id: 'sublime', label: 'Sublime' }
  ],

  actions: {
    setKeyMap(keyMap) {
      this.attrs.setKeyMap(keyMap);
    }
  }
});
