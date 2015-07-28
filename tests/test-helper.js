import Ember from "ember";
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import runGist from "./helpers/run-gist";

setResolver(resolver);
Ember.Test.registerAsyncHelper('runGist', runGist);
