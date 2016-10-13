import Ember from "ember";

export default Ember.Component.extend({

  filteredModel: Ember.computed.filter('model', function(gist) {
    return gist.get('files').map(function(file) {
      return file.get('fileName');
    }).includes('twiddle.json');
  })
});
