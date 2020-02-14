import {
  registerHelper,
  registerAsyncHelper
} from '@ember/test';
import Application from '../app';
import config from "../config/environment";
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import createGist from "./helpers/create-gist";
import runGist from "./helpers/run-gist";
import runRevision from "./helpers/run-revision";
import waitForLoadedIFrame from './helpers/wait-for-loaded-iframe';
import waitForUnloadedIFrame from './helpers/wait-for-unloaded-iframe';

let attributes = Object.assign({}, config.APP);
attributes.rootElement = "#main-test-app";
setApplication(Application.create(attributes));

const iframe = "iframe#dummy-content-iframe";

registerHelper('outputPane', function(app) {
  return app.testHelpers.find(iframe)[0].contentWindow;
});

registerHelper('outputContents', function(app, selector) {
  let output = app.testHelpers.outputPane();
  let outputDiv = output.document.querySelector('#root');
  if (selector) {
    return outputDiv.querySelector(selector).textContent.trim();
  }
  return outputDiv.textContent.trim();
});

registerHelper('createGist', createGist);
registerAsyncHelper('runGist', runGist);
registerAsyncHelper('runRevision', runRevision);
registerAsyncHelper('waitForLoadedIFrame', waitForLoadedIFrame);
registerAsyncHelper('waitForUnloadedIFrame', waitForUnloadedIFrame);

start();
