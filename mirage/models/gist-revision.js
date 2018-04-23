import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  gist: belongsTo(),
  owner: belongsTo(),
  files: hasMany('gistFile')
});
