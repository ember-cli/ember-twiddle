import DS from 'ember-data';
import Ember from 'ember';

const { attr } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  login: attr('string'),
  avatarUrl: attr('string'),
  htmlUrl: attr('string'),

  avatarUrl38: computed('avatarUrl', function() {
    return this.get('avatarUrl') + '&s=38';
  }),

  profileAvatarUrl: computed('avatarUrl', function() {
    return this.get('avatarUrl') + '&s=128';
  }),

  avatarUrl16: computed('avatarUrl', function() {
    return this.get('avatarUrl') + '&s=16';
  })
});
