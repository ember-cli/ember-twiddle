import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';
import JSONSerializer from '@ember-data/serializer/json';

export default JSONSerializer.extend(EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,

  keyForAttribute(key) {
    return key.decamelize();
  },

  keyForRelationship(key) {
    return key.decamelize();
  },
});
