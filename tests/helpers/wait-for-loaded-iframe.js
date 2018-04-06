import Ember from "ember";

const { RSVP, run } = Ember;

export default function(app) {
  let iframeWindow;

  // Wait until iframe loads
  return new RSVP.Promise(function (resolve) {
    let times = 0;

    run.schedule('afterRender', function waitForRender() {
      run.schedule('afterRender', function waitForRender() {
        function onWindowLoad() {
          iframeWindow.document.removeEventListener('DOMContentLoaded', onWindowLoad);
          resolve();
        }

        if (times++ >= 10) {
          // eslint-disable-next-line no-console
          console.warn('Timeout: Twiddle has failed to load');
          run.cancelTimers();
        } else if (app.testHelpers.find('iframe#dummy-content-iframe').length === 0) {
          run.later(waitForRender, 10);
          return;
        }
        iframeWindow = outputPane();
        let readyState = iframeWindow.document.readyState;
        if (readyState === 'complete' || readyState === 'interactive') {
          resolve();
        } else {
          iframeWindow.document.addEventListener('DOMContentLoaded', onWindowLoad);
        }
      });
    });
  });
}
