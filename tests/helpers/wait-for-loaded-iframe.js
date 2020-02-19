import Ember from "ember";
import { find } from '@ember/test-helpers';
import outputPane from './output-pane';

const { RSVP, run } = Ember;

export default async function(app, url) {
  let iframeWindow;

  // Wait until iframe loads
  await new RSVP.Promise(function (resolve) {
    let times = 0;

    run.schedule('afterRender', function waitForRender() {
      function onWindowLoad() {
        iframeWindow.document.removeEventListener('DOMContentLoaded', onWindowLoad);
        resolve();
      }

      if (times++ >= 10) {
        // eslint-disable-next-line no-console
        console.warn('Timeout: Twiddle has failed to load');
        run.cancelTimers();
      } else if (find('iframe#dummy-content-iframe').length === 0) {
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

  let times = 0;

  async function tryVisit() {
    url = url || "/";

    if (times++ >= 10) {
      run.cancelTimers();
    } else if (iframeWindow.visit) {
      await iframeWindow.visit(url);
    } else {
      run.later(async () => await tryVisit(), 10)
    }
  }
  await tryVisit();

  await new RSVP.Promise(function (resolve) {
    run.later(resolve, 10);
  });
}
