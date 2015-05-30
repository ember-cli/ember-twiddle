import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  github: Em.inject.service('github'),
  host:'https://api.github.com',
  headers: Em.computed('github._token', function() {
    var token  = this.get('github._token');
    if (token) {
      return {
        'Authorization': 'token ' + this.get('github._token')
      };
    }

    return {};
  }),


  /**
    Called by the store when an existing record is saved
    via the `save` method on a model record instance.
    The `updateRecord` method serializes the record and makes an Ajax (HTTP PUT) request
    to a URL computed by `buildURL`.
    See `serialize` for information on how to customize the serialized form
    of a record.
    @method updateRecord
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Snapshot} snapshot
    @return {Promise} promise
  */
  updateRecord: function(store, type, snapshot) {
    var data = {};
    var serializer = store.serializerFor(type.typeKey);

    serializer.serializeIntoHash(data, type, snapshot);

    var id = snapshot.id;
    var url = this.buildURL(type.typeKey, id, snapshot, 'updateRecord');

    return this.ajax(url, "PATCH", { data: data });
  },
});