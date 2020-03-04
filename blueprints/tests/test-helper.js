import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { assign } from '@ember/polyfills';
import { start } from 'ember-qunit';

let attributes = {
  rootElement: '#test-root',
  autoboot: false
};
attributes = assign(attributes, config.APP);

let application = Application.create(attributes);
setApplication(application);

start();
