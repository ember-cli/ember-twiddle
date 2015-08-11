import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['dropdown'],

  actions: {
    setKeyMap(keyMap) {
      this.attrs.setKeyMap(keyMap);
    }
  }
});
