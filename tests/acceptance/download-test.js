import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import * as FileSaver from 'file-saver';
import { timeout } from 'ember-concurrency';

moduleForAcceptance('Acceptance | download gist', {
  beforeEach: function() {
    this.fileSaved = false;
    this.origSaveAs = FileSaver.saveAs;

    window.saveAs = () => {
      this.fileSaved = true;
    };
    FileSaver.default.saveAs = window.saveAs;
    FileSaver.saveAs = window.saveAs;
  },

  afterEach: function() {
    window.saveAs = this.origSaveAs;
    FileSaver.default.saveAs = this.origSaveAs;
    FileSaver.saveAs = this.origSaveAs;
  }
});

test('can download gist', async function(assert) {
  // set owner of gist as currently logged in user
  stubValidSession(this.application, {
    currentUser: {login: "Gaurav0"},
    "github-oauth2": {}
  });

  await runGist([
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
