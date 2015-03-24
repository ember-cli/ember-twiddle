
export default Em.Object.extend({
  github: Ember.inject.service('github'),

  /**
   * Finds a gist by id
   * @return Promise
   */
  find (id) {
    var self = this;

    return this.github.find('/gists/' + id).then(function (json) {
      return self.deserialize(json);
    });
  },

  /**
   * Saves the current gist
   * @return Promise
   */
  save () {
    var self = this;

    return this.serialize().then(function(json) {
      self.github.update('/gists/' + self.get('id'), json);
    });
  },

  deserialize (json) {

  },

  serialize () {

  }
});