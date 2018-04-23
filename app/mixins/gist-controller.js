import Ember from "ember";

const { inject } = Ember;

export default Ember.Mixin.create({
  fastboot: inject.service(),

  queryParams: ['numColumns', 'fullScreen', 'route', 'openFiles', 'fileTreeShown'],
  numColumns: 1,
  fullScreen: false,
  openFiles: "",
  fileTreeShown: true,
  route: undefined,
  applicationUrl: undefined,
  unsaved: true,

  init() {
    this._super(...arguments);
    this.set('applicationUrl', this.get('route'));
  },

  actions: {
    transitionQueryParams(queryParams) {
      return this.transitionToRoute({ queryParams }).then(() => queryParams);
    }
  }
});
