import { filter } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({

  filteredModel: filter('model', function(gist) {
    let fileNames = gist.get('files').map(function(file) {
      return file.get('fileName');
    });
    return fileNames.any(fileName => /twiddle\\?.json/.test(fileName));
  })
});
