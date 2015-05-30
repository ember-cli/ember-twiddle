import DS from 'ember-data';

export default DS.Model.extend({
  login: DS.attr('string'),
  avatarUrl: DS.attr('string'),
  avatarUrl32: Em.computed('avatarUrl', function() {
    return this.get('avatarUrl') + '&s=32';
  })
});