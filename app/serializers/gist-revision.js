import GistSerializer from "./gist";

export default GistSerializer.extend({
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    return this._super(store, primaryModelClass, [payload], id, requestType);
  }
});
