import ApplicationAdapter from './application';

let seq = 0;

export default ApplicationAdapter.extend({
  generateIdForRecord: function(store, type, inputProperties) {
    let filename = inputProperties.filePath.replace(/\//gi, '.');
    return filename + "." + seq++;
  }
});
