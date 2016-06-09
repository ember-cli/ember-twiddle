import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  url: attr('string'),
  committedAt: attr('date'),
  gist: belongsTo('gist'),

  shortId: computed('id', function() {
    return (this.get('id')||'').substring(0,7);
  })
});
