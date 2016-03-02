import GistSerializer from "./gist";

export default GistSerializer.extend({
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    return this._super(store, primaryModelClass, [payload], id, requestType);
  }
});
