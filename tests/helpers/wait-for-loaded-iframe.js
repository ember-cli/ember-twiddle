import Ember from "ember";

export default function() {
  let iframe_window;

  andThen(function() {
    iframe_window = outputPane();

    // Wait until iframe loads
    return new Ember.RSVP.Promise(function (resolve) {
      iframe_window.addEventListener('load', function () {
        iframe_window.removeEventListener('load');
        resolve();
      });
    });
  });

  return andThen(function() {
    iframe_window.visit('/');
  });
}
