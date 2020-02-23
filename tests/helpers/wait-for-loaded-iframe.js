import Ember from "ember";
import { find, settled } from '@ember/test-helpers';
import outputPane from './output-pane';
import outputContents from './output-contents';

const { RSVP, run } = Ember;

export default async function(url) {
  let iframeWindow;

  await settled();

  // Wait until iframe loads
  await run(() => new RSVP.Promise(function (resolve) {
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
  }));

  url = url || "/";
  let times = 0;

  await run(() => new RSVP.Promise(resolve => {
    function tryVisit() {

      if (times++ >= 10) {
        run.cancelTimers();
        resolve();
      } else if (iframeWindow.visit) {
        run(() =>  {
          iframeWindow.visit(url).then(resolve);
        });
      } else {
        run.later(tryVisit, 10);
      }
    }
    run(tryVisit);
  }));

  await new RSVP.Promise(function (resolve) {
    run.later(resolve, 10);
  });

  await settled();

  times = 0;
  await run(() => new RSVP.Promise(resolve => {
    function waitForContents() {

      if (times++ >= 10) {
        run.cancelTimers();
        resolve();
      } else if (outputContents().length > 0) {
        resolve();
      } else {
        run.later(waitForContents, 10);
      }
    }
    run(waitForContents);
  }));
}
