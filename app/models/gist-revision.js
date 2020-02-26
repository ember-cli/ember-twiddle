import DS from 'ember-data';
import GistModel from "./gist";

const { attr } = DS;

export default GistModel.extend({
  revId: attr('string'),

  generateIdForRecord() {
    return this.id + '+' + this.revId;
  }
});
