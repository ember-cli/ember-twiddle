import Ember from 'ember';

export default Em.Route.extend({
  github: Ember.inject.service('github'),

  model: function(params) {
    return this.get('github').find('/gists/' + params.id);
  }
});