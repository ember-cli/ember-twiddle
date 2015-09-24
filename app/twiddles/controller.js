import Ember from "ember";

export default Ember.Controller.extend({

  // Not working correctly
  filteredModel: Ember.computed.filter('model', function(gist) {
    return gist.get('files').map(function(file) {
      return file.get('fileName');
    }).contains('twiddle.json');
  })
});
