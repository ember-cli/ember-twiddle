
export default Em.Object.extend({
  github: Em.inject.service('github'),
  id: null,

  isNew: Em.computed(() => {
    return this.get('id')===null;
  }),

  /**
   * Saves the current gist
   * @return Promise
   */
  save () {
    return this.get('isNew') ? this.github.postGist(this) : this.github.patchGist(this);
  }
});