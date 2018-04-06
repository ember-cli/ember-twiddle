import { test } from 'qunit';
import testSelector from 'ember-test-selectors';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import { find, click, visit } from 'ember-native-dom-helpers';

const filesMenuSelector = testSelector('column-files-menu');
const actionsMenuSelector = testSelector('column-actions-menu', '1');
const deleteFileSelector = testSelector('delete-file') + ' button';
const deleteFileConfirmSelector = testSelector('delete-file-confirm');

moduleForAcceptance('Acceptance | delete gist', {
  beforeEach() {
    server.create('user', { login: 'octocat' });
  }
});

test('can delete a gist', function(assert) {
  // set owner of gist as currently logged in user
  stubValidSession(this.application, {
    currentUser: {login: "Gaurav0"},
    "github-oauth2": {}
  });

  runGist([
    {
      filename: 'application.template.hbs',
      content: 'hello world!'
    }
  ]);

  return visit('/35de43cb81fc35ddffb2')
    .then(() => click(actionsMenuSelector))
    .then(() => {
      let el = find(deleteFileSelector, document.body);
      return click(el, document.body);
    })
    .then(() => click(deleteFileConfirmSelector))
    .then(() => {
      let menuButton = find(filesMenuSelector);
      let menuText = menuButton.textContent.trim();
      assert.ok(menuText.includes('No file selected'), 'File deleted');
    });
});
