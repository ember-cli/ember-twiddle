import Ember from 'ember';

const { inject } = Ember;

export default Ember.Component.extend({
  session: inject.service(),
  classNames: ['user-profile', 'layout-column']
});
