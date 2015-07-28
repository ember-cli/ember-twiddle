import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import runGist from "./run-gist";

export default function startApp(attrs) {
  var application;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    Ember.Test.registerAsyncHelper('runGist', runGist);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
