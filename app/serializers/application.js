import DS from 'ember-data';

export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  keyForAttribute: function(key) {
    return key.decamelize();
  },

  keyForRelationship: function(key) {
    return key.decamelize();
  },
});
