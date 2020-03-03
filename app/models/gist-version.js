import Model, { belongsTo, attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  url: attr('string'),
  committedAt: attr('date'),
  gist: belongsTo('gist'),

  shortId: computed('id', function() {
    return (this.id||'').substring(0,7);
  })
});
