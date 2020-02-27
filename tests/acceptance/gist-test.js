import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  visit,
  find,
  click,
  fillIn,
  currentURL,
  triggerEvent,
  triggerKeyEvent
} from '@ember/test-helpers';
import { findMapText } from 'ember-twiddle/tests/helpers/util';
import ErrorMessages from 'ember-twiddle/utils/error-messages';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import { timeout } from 'ember-concurrency';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import runGist from '../helpers/run-gist';
import waitForLoadedIFrame from '../helpers/wait-for-loaded-iframe';
import outputContents from '../helpers/output-contents';

const firstColumn = '[data-test-columns="1"]';
const firstColumnActionsMenu = '[data-test-column-actions-menu="1"]';
const firstColumnFilesMenu = '[data-test-column-files-menu="1"]';
const firstFile = '.ember-basic-dropdown-content md-menu-item:nth-child(1) button';
const secondFile = '.ember-basic-dropdown-content md-menu-item:nth-child(2) button';
const anyFile = '.ember-basic-dropdown-content md-menu-item button';
const sidebarMenuToggle = '.test-sidenav-toggle';
const deleteAction = '[data-test-delete-file] button';
const confirmDeleteAction = '[data-test-delete-file-confirm]';
const addFileMenuTrigger = '[data-test-add-file-menu-trigger]';
const addTestsMenuTrigger = '[data-test-add-tests-menu-trigger]';
const addUnitTestsMenuTrigger = '[data-test-add-unit-tests-menu-trigger]';
const addTemplateAction = '[data-test-add-template-action] button';
const componentMenuTrigger = '[data-test-add-component-menu-trigger]';
const addComponentAction = '[data-test-add-component-action] button';
const firstFilePickerFiles = '.ember-basic-dropdown-content md-menu-item button';
const firstColumnTextarea = firstColumn + ' .CodeMirror textarea';
const displayedFiles = '[data-test-column-files-menu] button .file-path';
const addColumnButton = '[data-test-column-add-panel="1"] button';
const displayedFilesNoneSelected = '[data-test-column-none-selected="1"]';

const firstFilePickerFileNames = () => Array.from(findAll(firstFilePickerFiles))
  .map(file => file.textContent);

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
    await click(firstColumnActionsMenu);
    await click(addColumnButton);
    await click(firstColumnFilesMenu);
    await click(secondFile);
    await click(firstColumnActionsMenu);
    await click(deleteAction);
    await click(confirmDeleteAction);

    assert.dom('.code .CodeMirror').doesNotExist('No code mirror editors active');
    assert.equal(find(displayedFilesNoneSelected).textContent, 'No file selected', 'Shows message when no file is selected.');

    // TODO: Replace brittle for loop test code with "while there are files left..."
    for (var i = 0; i < 2; ++i) {
      await click(firstColumnFilesMenu);
      await click(firstFile);
      await click(firstColumnActionsMenu);
      await click(deleteAction);
    }

    await click(firstColumnFilesMenu);

    assert.ok(find(anyFile).textContent.indexOf('twiddle.json')!==-1, 'twiddle.json remains');
    await click(anyFile);
  });


  test('can add two templates with different names', async function(assert) {
    await visit('/');
    await click(firstColumnFilesMenu);

    let origFiles = findAll(anyFile).length;
    await click(anyFile);
    promptValue = "foo/template.hbs";

    await click(anyFile);
    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click(addTemplateAction);
    await click(firstColumnFilesMenu);

    let numFiles;

    numFiles = findAll(anyFile).length;
    assert.equal(numFiles, origFiles + 1, 'Added first file');
    promptValue = "bar/template.hbs";

    await click(anyFile);
    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click(addTemplateAction);
    await click(firstColumnFilesMenu);

    numFiles = findAll(firstFilePickerFiles).length;

    assert.equal(numFiles, origFiles + 2, 'Added second file');
    click(anyFile);
  });

  test('can add component (js and hbs)', async function(assert) {
    promptValue = "components/my-comp";
    await visit('/');
    await click(firstColumnFilesMenu);

    let origFileCount = findAll(firstFilePickerFiles).length;

    await click(anyFile);
    await click(firstColumnActionsMenu);
    await click(addColumnButton);
    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click(componentMenuTrigger);
    await click(addComponentAction);
    await click(firstColumnFilesMenu);


    let numFiles = findAll(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 2, 'Added component files');
    let fileNames = findMapText(firstFilePickerFiles);
    let jsFile = `${promptValue}.js`;
    let hbsFile = `templates/${promptValue}.hbs`;
    assert.equal(fileNames[3], jsFile);
    assert.equal(fileNames[4], hbsFile);
    let columnFiles = findMapText(displayedFiles);
    assert.deepEqual(columnFiles, [jsFile, hbsFile], 'Added files are displayed');

    await click(anyFile);
  });

  test('can add component (js and hbs) using pod format', async function(assert) {
    promptValue = "my-comp";
    await visit('/');
    await click(firstColumnFilesMenu);
    let origFileCount =  find(firstFilePickerFiles).length;

    await click(anyFile);
    await click(firstColumnActionsMenu);
    await click(addColumnButton);
    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click(componentMenuTrigger);
    await click(addComponentAction);
    await click(firstColumnFilesMenu);

    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 2, 'Added component files');
    let fileNames = findMapText(firstFilePickerFiles);
    let jsFile = `${promptValue}/component.js`;
    let hbsFile = `${promptValue}/template.hbs`;
    assert.equal(fileNames[3], jsFile);
    assert.equal(fileNames[4], hbsFile);
    let columnFiles = findMapText(displayedFiles);
    assert.deepEqual(columnFiles, [jsFile, hbsFile], 'Added files are displayed');
    await click(anyFile);
  });

  test('component without hyphen fails', async function(assert) {
    assert.expect(1);
    // Overrides prompt result
    promptValue = 'components/some-dir/mycomp';

    await visit('/');
    await click(firstColumnActionsMenu);
    await click(addColumnButton);
    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click(componentMenuTrigger);
    await click(addComponentAction);
    assert.ok(find('.ember-notify').textContent.includes(ErrorMessages.componentsNeedHyphens), 'Shows no hyphen error');
  });

  test('can add service', async function(assert) {
    assert.expect(3);

    promptValue = "my-service/service.js";
    await visit('/');
    await click(firstColumnFilesMenu);
    let origFileCount = findAll(firstFilePickerFiles).length;

    await click(anyFile);
    await click(firstColumnActionsMenu);
    await click(addColumnButton);
    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click('[data-test-add-service-action] button');
    await click(firstColumnFilesMenu);

    let numFiles = findAll(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 1, 'Added service file');

    let fileNames = findMapText(firstFilePickerFiles);
    assert.equal(fileNames[3], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
    await click(anyFile);
  });

  test('can add route', async function(assert) {
    assert.expect(3);

    promptValue = "routes/my-route.js";
    await visit('/');
    let origFileCount = findAll(firstFilePickerFiles).length;

    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click('[data-test-add-route-action] button');
    await click(firstColumnFilesMenu);

    let numFiles = findAll(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 1, 'Added route file');

    let fileNames = firstFilePickerFileNames();
    assert.equal(fileNames[3], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added route is displayed');
  });

  test('can add helper', async function(assert) {
    assert.expect(3);

    promptValue = 'helpers/my-helper.js';
    await visit('/');
    await click(firstColumnFilesMenu);
    let origFileCount = find(firstFilePickerFiles).length;
    await click(anyFile);

    await click(firstColumnActionsMenu);
    await click(addColumnButton);
    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click('[data-test-add-helper-action] button');
    await click(firstColumnFilesMenu);

    let numFiles = findAll(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 1, 'Added helper file');

    let fileNames = findMapText(firstFilePickerFiles);
    assert.equal(fileNames[3], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
    await click(anyFile);
  });


  test('can add unit test', async function(assert) {
    assert.expect(3);

    promptValue = 'tests/unit/routes/my-route-test.js';
    await visit('/');
    await click(firstColumnFilesMenu);
    let origFileCount = findAll(firstFilePickerFiles).length;


    await click(firstColumnActionsMenu);
    await click(addColumnButton);
    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click(addTestsMenuTrigger);
    await click(addUnitTestsMenuTrigger);
    await click('[data-test-add-route-unit-test] button');
    await click(firstColumnFilesMenu);

    let numFiles = findAll(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 2, 'Added 2 test files');

    let fileNames = findMapText(firstFilePickerFiles);
    assert.equal(fileNames[fileNames.length - 1], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
    await click(anyFile);
  });


  test('can add integration test', async function(assert) {
    assert.expect(3);

    promptValue = 'tests/integration/components/my-component-test.js';
    await visit('/');
    let origFileCount = findAll(firstFilePickerFiles).length;

    await click(sidebarMenuToggle);
    await click('.test-add-component-test-link');
    await click(firstColumnFilesMenu);

    let numFiles = findAll(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 2, 'Added 2 test files');

    let fileNames = firstFilePickerFileNames();
    assert.equal(fileNames[fileNames.length - 1], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });

  test('can add acceptance test', async function(assert) {
    assert.expect(3);

    promptValue = 'tests/acceptance/my-acceptance-test.js';
    await visit('/');
    let origFileCount = findAll(firstFilePickerFiles).length;

    await click(sidebarMenuToggle);
    await click('.test-add-acceptance-test-link');
    await click(firstColumnFilesMenu);

    let numFiles = findAll(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 5, 'Added 5 test files');

    let fileNames = firstFilePickerFileNames();
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

    await click(firstColumnTextarea());
    await fillIn(firstColumnTextarea(), "\"some text\";");
    await triggerEvent(firstColumnTextarea(), "blur");
    await triggerEvent(firstColumnTextarea(), "focusout");
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

    await click(sidebarMenuToggle);
    await click(addFileMenuTrigger);
    await click(addTemplateAction);
    await click(firstColumnFilesMenu);

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
    await triggerKeyEvent('.title input', 'keyup', 13);
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
    await waitForLoadedIFrame();
    assert.equal(currentURL(), '/');
    assert.dom('.title input').hasValue("New Twiddle", "Description is reset");
    assert.dom('.test-unsaved-indicator').doesNotExist("Unsaved indicator does not appear when gist is copied");
    assert.equal(outputContents(), 'hello world!');
  });
});
