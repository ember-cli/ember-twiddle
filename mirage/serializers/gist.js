import ApplicationSerializer from './application';
import { isArray } from '@ember/array';

export default ApplicationSerializer.extend({
  include: ['owner', 'files', 'history'],
  serialize() {
    let payload = ApplicationSerializer.prototype.serialize.apply(this, arguments);
    let files = payload.files;
    if (files) {
      payload.files = {};
      files.forEach(file => {
        payload.files[file.filename] = file;
      });
    } else if (isArray(payload)) {
      payload.forEach(obj => {
        files = obj.files;
        obj.files = {};
        files.forEach(file => {
          obj.files[file.filename] = file;
        });
      });
    }
    return payload;
  }
});
