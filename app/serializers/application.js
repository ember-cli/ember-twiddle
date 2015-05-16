import DS from 'ember-data';

export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
  keyForAttribute: function(key, method) {
    return key.decamelize();
  },


  keyForRelationship: function(key, typeClass, method) {
    return key.decamelize();
  },
});