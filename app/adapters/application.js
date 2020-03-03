import RESTAdapter from '@ember-data/adapter/rest';
import { computed } from '@ember/object';
import config from '../config/environment';

export default RESTAdapter.extend({

  host: config.host,

  headers: computed('session.token', function() {
    let headers = {};

    var token  = this.get('session.token') || config.TMP_TORII_TOKEN;
    if (token) {
      headers['Authorization'] = 'token ' + token;
    }

    return headers;
  }),

  shouldReloadAll() { return true; },
  shouldReloadRecord() { return true; },

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
  updateRecord(store, type, snapshot) {
    var data = {};
    var serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(data, type, snapshot);

    var id = snapshot.id;
    var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

    return this.ajax(url, "PATCH", { data: data });
  }
});
