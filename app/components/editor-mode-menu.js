import Component from '@ember/component';

export default Component.extend({
  tagName: 'li',
  classNames: ['dropdown', 'dropup'],

  actions: {
    setKeyMap(keyMap) {
      this.setKeyMap(keyMap);
    }
  }
});
