import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFind: function(id, typeKey) {
    if(id==='current') {
      var url = this._buildURL(typeKey);
      return url.substring(0, url.length-1);
    }

    return this._buildURL(typeKey, id);
  }
});
