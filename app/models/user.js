import DS from 'ember-data';
import Ember from 'ember';

const { attr } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  login: attr('string'),
  avatarUrl: attr('string'),
  htmlUrl: attr('string'),


  avatarUrl38: computed('avatarUrl', function() {
    return this.avatarUrl + '&s=38';
  }),

  avatarUrl32: computed('avatarUrl', function() {
    return this.avatarUrl + '&s=32';
  }),

  profileAvatarUrl: computed('avatarUrl', function() {
    return this.avatarUrl + '&s=128';
  }),

  avatarUrl16: computed('avatarUrl', function() {
    return this.avatarUrl + '&s=16';
  })
});
