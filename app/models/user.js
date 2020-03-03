import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  login: attr('string'),
  name: attr('string'),
  avatarUrl: attr('string'),
  htmlUrl: attr('string'),

  avatarUrl32: computed('avatarUrl', function() {
    return this.avatarUrl + '&s=32';
  }),

  avatarUrl16: computed('avatarUrl', function() {
    return this.avatarUrl + '&s=16';
  }),
});
