import Ember from "ember";

const { RSVP, run } = Ember;

export default function(app, url) {
  let iframe_window;

  andThen(function() {

    // Wait until iframe loads
    return new RSVP.Promise(function (resolve, reject) {
      let times = 0;

      run.schedule('afterRender', function waitForRender() {
        function onWindowLoad() {
          iframe_window.removeEventListener('load', onWindowLoad);
          resolve();
        }

        if (times++ >= 10) {
          run.cancelTimers();
          reject();
        }
        if (app.testHelpers.find('iframe').length === 0) {
          run.later(waitForRender, 10);
          return;
        }
        iframe_window = outputPane();
        if (iframe_window.document.readyState === 'complete') {
          resolve();
        } else {
          iframe_window.addEventListener('load', onWindowLoad);
        }
      });
    });
  });

  return andThen(function() {
    url = url || "/";
    iframe_window.visit(url);
  });
}
