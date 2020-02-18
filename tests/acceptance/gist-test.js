import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { findMapText } from 'ember-twiddle/tests/helpers/util';
import ErrorMessages from 'ember-twiddle/utils/error-messages';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import { timeout } from 'ember-concurrency';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import waitForLoadedIFrame from '../helpers/wait-for-loaded-iframe';
import waitForUnloadedIFrame from '../helpers/wait-for-unloaded-iframe';
import outputContents from '../helpers/output-contents';

const firstColumn = '.code:eq(0)';
const firstFilePicker = firstColumn + ' .dropdown-toggle';
const secondFile = firstColumn + ' .dropdown-menu li:nth-child(2) a';
const anyFile = firstColumn + ' .dropdown-menu li:nth-child(1) a';
const fileMenu = '.main-menu .dropdown-toggle';
const deleteAction = '.main-menu a:contains(Delete)';
const addTemplateAction = '.test-template-action';
const firstFilePickerFiles = firstColumn + ' .dropdown-menu>li';
const firstColumnTextarea = firstColumn + ' .CodeMirror textarea';
const displayedFiles = '.file-picker > li > a';
const plusGlyph = ".code .glyphicon-plus";

let promptValue = '';

module('Acceptance | gist', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cacheConfirm = window.confirm;
    this.cachePrompt = window.prompt;
    this.cacheAlert = window.alert;
    window.confirm = () => true;
    window.prompt = () => promptValue;

    server.create('user', { login: 'octocat' });
  });

  hooks.afterEach(function() {
    window.confirm = this.cacheConfirm;
    window.prompt = this.cachePrompt;
    window.alert = this.cacheAlert;
  });

  test('deleting a gist loaded in two columns', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/', 'We are on the correct route');
    await click(plusGlyph);
    await click(firstFilePicker);
    await click(secondFile);
    await click(firstFilePicker);
    await click(fileMenu);
    await click(deleteAction);
    assert.dom('.code .CodeMirror').doesNotExist('No code mirror editors active');
    assert.equal(find('.dropdown-toggle:contains(No file selected)').length, 2, 'Shows message when no file is selected.');
    assert.dom('.main-menu .test-remove-action').doesNotExist('There no longer is a selected file to delete');

    // TODO: Replace brittle for loop test code with "while there are files left..."
    for (var i = 0; i < 1; ++i) {
      await click(firstFilePicker);
      await click(anyFile);
      await click(fileMenu);
      await click(deleteAction);
    }

    await click(firstFilePicker);
    assert.ok(find(anyFile).text().indexOf('twiddle.json')!==-1, 'twiddle.json remains');
  });

  test('can add two templates with different names', async function(assert) {
    await visit('/');
    let origFiles;

    await click(firstFilePicker);
    origFiles = find(firstFilePickerFiles).length;
    promptValue = "foo/template.hbs";
    await click(fileMenu);
    await click(addTemplateAction);
    await click(firstFilePicker);

    let numFiles;

    numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFiles + 1, 'Added first file');
    promptValue = "bar/template.hbs";
    await click(fileMenu);
    await click(addTemplateAction);
    await click(firstFilePicker);
    numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFiles + 2, 'Added second file');
  });

  test('can add component (js and hbs)', async function(assert) {
    let origFileCount;
    promptValue = "components/my-comp";
    await visit('/');
    origFileCount =  find(firstFilePickerFiles).length;

    await click(plusGlyph);
    await click(fileMenu);
    await click('.add-component-link');
    await click(firstFilePicker);
    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 2, 'Added component files');
    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    let jsFile = `${promptValue}.js`;
    let hbsFile = `templates/${promptValue}.hbs`;
    assert.equal(fileNames[3], jsFile);
    assert.equal(fileNames[4], hbsFile);
    let columnFiles = findMapText(displayedFiles);
    assert.deepEqual(columnFiles, [jsFile, hbsFile], 'Added files are displayed');
  });

  test('can add component (js and hbs) using pod format', async function(assert) {
    let origFileCount;
    promptValue = "my-comp";
    await visit('/');
    origFileCount =  find(firstFilePickerFiles).length;

    await click(plusGlyph);
    await click(fileMenu);
    await click('.add-component-link');
    await click(firstFilePicker);
    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 2, 'Added component files');
    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    let jsFile = `${promptValue}/component.js`;
    let hbsFile = `${promptValue}/template.hbs`;
    assert.equal(fileNames[3], jsFile);
    assert.equal(fileNames[4], hbsFile);
    let columnFiles = findMapText(displayedFiles);
    assert.deepEqual(columnFiles, [jsFile, hbsFile], 'Added files are displayed');
  });

  test('component without hyphen fails', async function(assert) {
    assert.expect(2);

    let called = false;
    window.alert = function(msg){
      called = true;
      assert.equal(msg, ErrorMessages.componentsNeedHyphens);
    };
    promptValue = "components/some-dir/mycomp";

    await visit('/');
    await click('.add-component-link');
    await click(firstFilePicker);
    assert.ok(called, "alert was called");
  });

  test('can add service', async function(assert) {
    assert.expect(3);

    let origFileCount;
    promptValue = "my-service/service.js";
    await visit('/');
    origFileCount = find(firstFilePickerFiles).length;

    await click(fileMenu);
    await click('.test-add-service-link');
    await click(firstFilePicker);

    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 1, 'Added service file');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[3], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });

  test('can add route', async function(assert) {
    assert.expect(3);

    let origFileCount;
    promptValue = "routes/my-route.js";
    await visit('/');
    origFileCount = find(firstFilePickerFiles).length;

    await click(fileMenu);
    await click('.test-add-route-link');
    await click(firstFilePicker);

    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 1, 'Added route file');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[3], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added route is displayed');
  });

  test('can add helper', async function(assert) {
    assert.expect(3);

    let origFileCount;
    promptValue = 'helpers/my-helper.js';
    await visit('/');
    origFileCount = find(firstFilePickerFiles).length;

    await click(fileMenu);
    await click('.test-add-helper-link');
    await click(firstFilePicker);

    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 1, 'Added helper file');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[3], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });

  test('can add unit test', async function(assert) {
    assert.expect(3);

    let origFileCount;
    promptValue = 'tests/unit/routes/my-route-test.js';
    await visit('/');
    origFileCount = find(firstFilePickerFiles).length;

    await click(fileMenu);
    await click('.test-add-route-test-link');
    await click(firstFilePicker);

    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 2, 'Added 2 test files');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[fileNames.length - 1], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });

  test('can add integration test', async function(assert) {
    assert.expect(3);

    let origFileCount;
    promptValue = 'tests/integration/components/my-component-test.js';
    await visit('/');
    origFileCount = find(firstFilePickerFiles).length;

    await click(fileMenu);
    await click('.test-add-component-test-link');
    await click(firstFilePicker);

    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 2, 'Added 2 test files');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[fileNames.length - 1], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });

  test('can add acceptance test', async function(assert) {
    assert.expect(3);

    let origFileCount;
    promptValue = 'tests/acceptance/my-acceptance-test.js';
    await visit('/');
    origFileCount = find(firstFilePickerFiles).length;

    await click("#live-reload");
    await click(fileMenu);
    await click('.test-add-acceptance-test-link');
    await click(firstFilePicker);

    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 5, 'Added 5 test files');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[fileNames.length - 1], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });

  test('unsaved indicator', async function(assert) {
    const indicator = ".test-unsaved-indicator";

    await visit('/');

    assert.dom(indicator).doesNotExist("Unsaved indicator does not appear when first loading");

    // Below doesn't work in phantomjs:
    if (/PhantomJS/.test(window.navigator.userAgent)) {
      return;
    }

    await click(firstColumnTextarea);
    await fillIn(firstColumnTextarea, "\"some text\";");
    await triggerEvent(firstColumnTextarea, "blur");
    await triggerEvent(firstColumnTextarea, "focusout");
    await timeout(10);
    assert.dom(indicator).exists({ count: 1 }, "Unsaved indicator reappears after editing");
  });

  test('editing a file updates gist', async function(assert) {
    const files = [
      {
        filename: "templates.application.hbs",
        content: "{{outlet}}"
      }
    ];

    await runGist(files);

    promptValue = "templates/index.hbs";

    await click(fileMenu);
    await click(addTemplateAction);
    await click(firstFilePicker);

    assert.dom(firstColumnTextarea).hasValue("");

    // Below doesn't work in phantomjs:
    if (/PhantomJS/.test(window.navigator.userAgent)) {
      return;
    }

    await click("#live-reload");
    await click(firstColumnTextarea);
    await fillIn(firstColumnTextarea, '<div class="index">some text</div>');
    await triggerEvent(firstColumnTextarea, "blur");
    await triggerEvent(firstColumnTextarea, "focusout");

    await timeout(10);
    assert.dom(firstColumnTextarea).hasValue('<div class="index">some text</div>');

    await click(".run-now");
    await waitForUnloadedIFrame();
    await waitForLoadedIFrame();
    assert.equal(outputContents('.index'), 'some text');
  });

  test('own gist can be copied into a new one', async function(assert) {
    // set owner of gist as currently logged in user
    stubValidSession(this, {
      currentUser: { login: "Gaurav0" },
      "github-oauth2": {}
    });

    await runGist([
      {
        filename: 'application.template.hbs',
        content: 'hello world!'
      }
    ]);

    assert.dom('.test-unsaved-indicator').doesNotExist("No unsaved indicator shown");

    await fillIn('.title input', "my twiddle");
    keyEvent('.title input', 'keyup', 13);
    assert.dom('.title input').hasValue("my twiddle");

    await click("#live-reload");
    await click('.test-copy-action');
    await waitForLoadedIFrame();
    assert.dom('.title input').hasValue("New Twiddle", "Description is reset");
    assert.dom('.test-unsaved-indicator').doesNotExist("Unsaved indicator does not appear when gist is copied");
    assert.dom('.test-copy-action').doesNotExist("Menu item to copy gist is not shown anymore");
    assert.equal(outputContents(), 'hello world!');
  });

  test('accessing /:gist/copy creates a new Twiddle with a copy of the gist', async function(assert) {
    await runGist([
      {
        filename: 'application.template.hbs',
        content: 'hello world!'
      }
    ]);

    assert.dom('.test-unsaved-indicator').doesNotExist("No unsaved indicator shown");

    await fillIn('.title input', "my twiddle");
    assert.dom('.title input').hasValue("my twiddle");
    assert.dom('.test-unsaved-indicator').exists({ count: 1 }, "Changing title triggers unsaved indicator");

    await click("#live-reload");
    await visit('/35de43cb81fc35ddffb2/copy');
    await click(".run-now");
    await waitForUnloadedIFrame();
    await waitForLoadedIFrame();
    assert.equal(currentURL(), '/');
    assert.dom('.title input').hasValue("New Twiddle", "Description is reset");
    assert.dom('.test-unsaved-indicator').doesNotExist("Unsaved indicator does not appear when gist is copied");
    assert.equal(outputContents(), 'hello world!');
  });
});
