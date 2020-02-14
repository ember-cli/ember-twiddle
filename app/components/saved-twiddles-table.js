import { filter } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({

  filteredModel: filter('model', function(gist) {
    return gist.get('files').map(function(file) {
      return file.get('fileName');
    }).includes('twiddle.json');
  })
});
