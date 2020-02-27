import { isArray } from '@ember/array';
import runGist from "./run-gist";

export default async function(options) {
  if (isArray(options)) {
    options = {files: options};
  }

  options.type = "revision";

  return await runGist(options);
}
