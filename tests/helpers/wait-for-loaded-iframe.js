import Ember from "ember";

const { RSVP, run, warn } = Ember;

export default function(app, url) {
  let iframe_window;

  andThen(function() {

    // Wait until iframe loads
    return new RSVP.Promise(function (resolve) {
      let times = 0;

      run.schedule('afterRender', function waitForRender() {
        function onWindowLoad() {
          iframe_window.document.removeEventListener('DOMContentLoaded', onWindowLoad);
          resolve();
        }

        if (times++ >= 10) {
          warn('Timeout: Twiddle has failed to load');
          run.cancelTimers();
        } else if (app.testHelpers.find('iframe').length === 0) {
          run.later(waitForRender, 10);
          return;
        }
        iframe_window = outputPane();
        let readyState = iframe_window.document.readyState;
        if (readyState === 'complete' || readyState === 'interactive') {
          resolve();
        } else {
          iframe_window.document.addEventListener('DOMContentLoaded', onWindowLoad);
        }
      });
    });
  });

  return andThen(function() {
    url = url || "/";
    iframe_window.visit(url);
  });
}
