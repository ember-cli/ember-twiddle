import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'tr',

  numFiles: Ember.computed('gist.files.[]', function() {
    return this.get('gist.files.length');
  }),

  filesTitle: Ember.computed('gist.files.@each.filePath', function() {
    return this.get('gist.files').toArray().mapBy('filePath').join("\n");
  })
});
