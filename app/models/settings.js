import Ember from 'ember';
import _merge from 'lodash/object/merge';

const {
  ObjectProxy,
  get,
  set
} = Ember;

export default ObjectProxy.extend({
  storageKey: 'ember_twiddle_settings',

  defaultSettings: {
    keyMap: 'basic'
  },

  init() {
    const storageKey = get(this, 'storageKey');
    const defaultSettings = get(this, 'defaultSettings');
    const localSettings = get(this, 'isFastBoot') ? {} : JSON.parse(localStorage.getItem(storageKey)) || {};

    set(this, 'content', _merge(defaultSettings, localSettings));

    this._super(...arguments);
  },

  save() {
    const storageKey = get(this, 'storageKey');
    const newSettings = JSON.stringify(get(this, 'content'));

    if (!get(this, 'isFastBoot')) {
      localStorage.setItem(storageKey, newSettings);
    }
  }
});
