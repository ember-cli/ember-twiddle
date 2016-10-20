import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['dropdown', 'dropup'],

  actions: {
    setKeyMap(keyMap) {
      this.attrs.setKeyMap(keyMap);
    }
  }
});
