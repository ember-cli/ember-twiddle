import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import * as FileSaver from 'file-saver';
import { timeout } from 'ember-concurrency';
import runGist from '../helpers/run-gist';
import waitForLoadedIFrame from '../helpers/wait-for-loaded-iframe';

module('Acceptance | download gist', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.fileSaved = false;
    this.origSaveAs = FileSaver.saveAs;

    window.saveAs = () => {
      this.fileSaved = true;
    };
    FileSaver.default.saveAs = window.saveAs;
    FileSaver.saveAs = window.saveAs;
  });

  hooks.afterEach(function() {
    window.saveAs = this.origSaveAs;
    FileSaver.default.saveAs = this.origSaveAs;
    FileSaver.saveAs = this.origSaveAs;
  });

  test('can download gist', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this.application, {
      currentUser: {login: "Gaurav0"},
      "github-oauth2": {}
    });

    await await runGist([
      {
        filename: 'application.template.hbs',
        content: 'hello world!'
      }
    ]);

    await visit('/35de43cb81fc35ddffb2');

    await waitForLoadedIFrame();

    await click('.test-download-project-action');

    await timeout(10);

    assert.equal(this.fileSaved, true, 'file saved');
  });
});
