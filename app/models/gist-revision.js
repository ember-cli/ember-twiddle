import DS from 'ember-data';

export default DS.Model.extend({
  committedAt: DS.attr('date'),
  shortId: DS.attr('string')
});