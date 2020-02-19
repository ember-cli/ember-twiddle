import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { assign } from '@ember/polyfills';

let attributes = assign({ rootElement: '#main' }, config.APP);
setApplication(Application.create(attributes));

start();
