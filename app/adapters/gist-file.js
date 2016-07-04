import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  generateIdForRecord: function(store, type, inputProperties) {
    return inputProperties.filePath.replace(/\//gi, '.');
  }
});
