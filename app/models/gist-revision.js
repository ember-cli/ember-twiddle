import { attr } from '@ember-data/model';
import GistModel from "./gist";

export default GistModel.extend({
  revId: attr('string'),

  generateIdForRecord() {
    return this.id + '+' + this.revId;
  }
});
