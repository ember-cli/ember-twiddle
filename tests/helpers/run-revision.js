import Ember from "ember";
import runGist from "./run-gist";

const { isArray } = Ember;

export default function(app, options) {
  if (isArray(options)) {
    options = {files: options};
  }

  options.type = "revision";

  return runGist(app, options);
}
