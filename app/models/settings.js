import { get } from '@ember/object';
import _merge from 'lodash/merge';
import DS from 'ember-data';


const KNOWN_PROPERTIES = [ 'isFastBoot' ];

export default DS.Model.extend({
  storageKey: 'ember_twiddle_settings',

  // eslint-disable-next-line
  defaultSettings: {
    keyMap: 'default'
  },

  settings: null,

  unknownProperty(property) {
    if (this.settings) {
      if (property in this.settings) {
        return this.settings[property];
      }
    }

    return this._super(...arguments);
  },

  setUnknownProperty(property, value) {
    if (!this.settings || KNOWN_PROPERTIES.includes(property)) {
      this._super(...arguments);
    } else {
      this.settings[property] = value;
    }
  },

  init() {
    const storageKey = get(this, 'storageKey');
    const defaultSettings = get(this, 'defaultSettings');
    const localSettings = get(this, 'isFastBoot') ? {} : JSON.parse(localStorage.getItem(storageKey)) || {};
    const newSettings = _merge(defaultSettings, localSettings);

    this.settings = newSettings;

    this._super(...arguments);
  },

  save() {
    const storageKey = get(this, 'storageKey');
    const newSettings = JSON.stringify(get(this, 'settings'));

    if (!get(this, 'isFastBoot')) {
      localStorage.setItem(storageKey, newSettings);
    }
  }
});
