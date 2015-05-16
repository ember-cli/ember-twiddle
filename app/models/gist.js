import DS from 'ember-data';

export default DS.Model.extend({
  url: DS.attr('string'),
  description: DS.attr('string'),
  htmlUrl: DS.attr('string'),
  files: DS.hasMany('gistFile'),
  history: DS.hasMany('gistRevision'),
});