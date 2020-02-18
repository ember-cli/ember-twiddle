import Ember from "ember";
import Application from '../app';
import config from "../config/environment";
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import createGist from "./helpers/create-gist";
import runGist from "./helpers/run-gist";
import runRevision from "./helpers/run-revision";
import waitForLoadedIFrame from './helpers/wait-for-loaded-iframe';
import waitForUnloadedIFrame from './helpers/wait-for-unloaded-iframe';
import './helpers/responsive';

let attributes = Object.assign({}, config.APP);
attributes.rootElement = "#main-test-app";
setApplication(Application.create(attributes));

const iframe = "iframe#dummy-content-iframe";

Ember.Test.registerHelper('outputPane', function(app) {
  return app.testHelpers.find(iframe)[0].contentWindow;
});

Ember.Test.registerHelper('outputContents', function(app, selector) {
  let output = app.testHelpers.outputPane();
  let outputDiv = output.document.querySelector('#root');
  if (selector) {
    return outputDiv.querySelector(selector).textContent.trim();
  }
  return outputDiv.textContent.trim();
});

Ember.Test.registerHelper('createGist', createGist);
Ember.Test.registerAsyncHelper('runGist', runGist);
Ember.Test.registerAsyncHelper('runRevision', runRevision);
Ember.Test.registerAsyncHelper('waitForLoadedIFrame', waitForLoadedIFrame);
Ember.Test.registerAsyncHelper('waitForUnloadedIFrame', waitForUnloadedIFrame);

start();
