import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  generateIdForRecord(store, type, inputProperties) {
    return inputProperties.filePath.replace(/\./gi, '\\.').replace(/\//gi, '.');
  }
});
