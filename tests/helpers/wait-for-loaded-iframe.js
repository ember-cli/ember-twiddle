import Ember from "ember";

export default function(app, url) {
  let iframe_window;

  andThen(function() {
    iframe_window = outputPane();

    // Wait until iframe loads
    return new Ember.RSVP.Promise(function (resolve) {
      function onWindowLoad() {
        iframe_window.removeEventListener('load', onWindowLoad);
        resolve();
      }

      iframe_window.addEventListener('load', onWindowLoad);
    });
  });

  return andThen(function() {
    url = url || "/";
    iframe_window.visit(url);
  });
}
