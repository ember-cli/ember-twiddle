import Ember from "ember";
import resolver from './helpers/resolver';
import './helpers/responsive';

import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';
import createGist from "./helpers/create-gist";
import runGist from "./helpers/run-gist";
import runRevision from "./helpers/run-revision";
import waitForLoadedIFrame from './helpers/wait-for-loaded-iframe';
import waitForUnloadedIFrame from './helpers/wait-for-unloaded-iframe';

setResolver(resolver);

const iframe = "iframe#dummy-content-iframe";

Ember.Test.registerHelper('outputPane', function(app) {
  return app.testHelpers.find(iframe)[0].contentWindow;
});

Ember.Test.registerHelper('outputContents', function(app, selector) {
  let output = app.testHelpers.outputPane().document;
  return output.querySelector(selector).textContent.trim();
});

Ember.Test.registerHelper('createGist', createGist);
Ember.Test.registerAsyncHelper('runGist', runGist);
Ember.Test.registerAsyncHelper('runRevision', runRevision);
Ember.Test.registerAsyncHelper('waitForLoadedIFrame', waitForLoadedIFrame);
Ember.Test.registerAsyncHelper('waitForUnloadedIFrame', waitForUnloadedIFrame);

start();
