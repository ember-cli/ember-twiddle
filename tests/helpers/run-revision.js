import { isArray } from '@ember/array';
import runGist from "./run-gist";

export default function(app, options) {
  if (isArray(options)) {
    options = {files: options};
  }

  options.type = "revision";

  return runGist(app, options);
}
