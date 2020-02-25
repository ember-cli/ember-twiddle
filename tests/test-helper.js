import Application from '../app';
import config from "../config/environment";
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

let attributes = Object.assign({}, config.APP);
setApplication(Application.create(attributes));

start();
