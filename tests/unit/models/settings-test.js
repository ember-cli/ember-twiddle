import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const {
  getProperties,
  get,
  set
} = Ember;

moduleFor('model:settings', 'Unit | Model | Settings', {
  beforeEach() {
    window.localStorage.clear();
  },

  afterEach() {
    window.localStorage.clear();
  }
});

test('it has default settings when no local settings are present', function(assert) {
  assert.expect(1);

  const settings = this.subject();

  assert.deepEqual(getProperties(settings, 'keyMap'), {
    keyMap: 'basic'
  }, 'default settings are present');
});

test('settings stored in localStorage override default settings', function(assert) {
  assert.expect(1);

  const localSettings = JSON.stringify({ keyMap: 'vim' });
  window.localStorage.setItem('ember_twiddle_settings', localSettings);

  const settings = this.subject();

  assert.deepEqual(getProperties(settings, 'keyMap'), {
    keyMap: 'vim'
  }, 'local settings overrode default settings');
});

test('save() persists settings to localStorage', function(assert) {
  assert.expect(1);

  const settings = this.subject();

  set(settings, 'keyMap', 'emacs');
  settings.save();

  const anotherSettings = this.subject();
  assert.equal(get(anotherSettings, 'keyMap'), 'emacs',
    'new Settings has previously persisted settings');
});
