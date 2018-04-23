import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  user: belongsTo(),
  owner: belongsTo(),
  history: hasMany('gistRevision'),
  files: hasMany('gistFile')
});
