import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  seq: 0,

	generateIdForRecord: function(store, type, inputProperties) {
	  return inputProperties.filePath.replace(/\//gi, '.') + "." + this.incrementProperty('seq');
	}
});
