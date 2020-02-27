import Ember from "ember";
import runGist from "./run-gist";

const { isArray } = Ember;

export default async function(options) {
  if (isArray(options)) {
    options = {files: options};
  }

  options.type = "revision";

  return await runGist(options);
}
