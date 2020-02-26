import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'tr',

  numFiles: computed('gist.files.[]', function() {
    return this.get('gist.files.length');
  }),

  filesTitle: computed('gist.files.@each.filePath', function() {
    return this.get('gist.files').toArray().mapBy('filePath').join("\n");
  })
});
