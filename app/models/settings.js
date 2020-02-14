import ObjectProxy from '@ember/object/proxy';
import EmberObject, { get } from '@ember/object';
import _merge from 'lodash/merge';

export default ObjectProxy.extend({
  storageKey: 'ember_twiddle_settings',

  // eslint-disable-next-line
  defaultSettings: {
    keyMap: 'default'
  },

  init() {
    const storageKey = get(this, 'storageKey');
    const defaultSettings = get(this, 'defaultSettings');
    const localSettings = get(this, 'isFastBoot') ? {} : JSON.parse(localStorage.getItem(storageKey)) || {};
    const newSettings = _merge(defaultSettings, localSettings);

    this.content = EmberObject.create(newSettings);
    this.content.setProperties(this.content);

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
