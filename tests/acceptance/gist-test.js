import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { findMapText } from 'ember-twiddle/tests/helpers/util';
import ErrorMessages from 'ember-twiddle/utils/error-messages';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import { timeout } from 'ember-concurrency';

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

moduleForAcceptance('Acceptance | gist', {
  beforeEach: function() {
    this.cacheConfirm = window.confirm;
    this.cachePrompt = window.prompt;
    this.cacheAlert = window.alert;
    window.confirm = () => true;
    window.prompt = () => promptValue;

    server.create('user', { login: 'octocat' });
  },

  afterEach: function() {
    window.confirm = this.cacheConfirm;
    window.prompt = this.cachePrompt;
    window.alert = this.cacheAlert;
  }
});

test('deleting a gist loaded in two columns', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct route');
    click(plusGlyph);
    click(firstFilePicker);
    click(secondFile);
    click(firstFilePicker);
    click(fileMenu);
    click(deleteAction);
    andThen(function() {
      assert.equal(find('.code .CodeMirror').length, 0, 'No code mirror editors active');
      assert.equal(find('.dropdown-toggle:contains(No file selected)').length, 2, 'Shows message when no file is selected.');
      assert.equal(find('.main-menu .test-remove-action').length, 0, 'There no longer is a selected file to delete');
    });

    // TODO: Replace brittle for loop test code with "while there are files left..."
    for (var i = 0; i < 2; ++i) {
      click(firstFilePicker);
      click(anyFile);
      click(fileMenu);
      click(deleteAction);
    }

    andThen(function() {
      click(firstFilePicker);
      assert.ok(find(anyFile).text().indexOf('twiddle.json')!==-1, 'twiddle.json remains');
    });
  });
});

test('can add two templates with different names', function(assert) {
  visit('/');
  let origFiles;

  andThen(function() {
    click(firstFilePicker);
  });

  andThen(function() {
    origFiles = find(firstFilePickerFiles).length;
    promptValue = "foo/template.hbs";
    click(fileMenu);
    click(addTemplateAction);
    click(firstFilePicker);
  });

  let numFiles;

  andThen(function() {
    numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFiles + 1, 'Added first file');
    promptValue = "bar/template.hbs";
    click(fileMenu);
    click(addTemplateAction);
    click(firstFilePicker);
  });

  andThen(function() {
    numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFiles + 2, 'Added second file');
  });
});

test('can add component (js and hbs)', function(assert){

  let origFileCount;
  promptValue = "components/my-comp";
  visit('/');
  andThen(function(){
    origFileCount =  find(firstFilePickerFiles).length;
  });

  click(plusGlyph);
  click(fileMenu);
  click('.add-component-link');
  click(firstFilePicker);
  andThen(function() {
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
});

test('can add component (js and hbs) using pod format', function(assert){

  let origFileCount;
  promptValue = "my-comp";
  visit('/');
  andThen(function(){
    origFileCount =  find(firstFilePickerFiles).length;
  });

  click(plusGlyph);
  click(fileMenu);
  click('.add-component-link');
  click(firstFilePicker);
  andThen(function() {
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
});

test('component without hyphen fails', function(assert){
  assert.expect(2);

  let called = false;
  window.alert = function(msg){
    called = true;
    assert.equal(msg, ErrorMessages.componentsNeedHyphens);
  };
  promptValue = "components/some-dir/mycomp";

  visit('/');
  click('.add-component-link');
  click(firstFilePicker);
  andThen(function(){
    assert.ok(called, "alert was called");
  });
});

test('can add service', function(assert){
  assert.expect(3);

  let origFileCount;
  promptValue = "my-service/service.js";
  visit('/');
  andThen(function(){
    origFileCount = find(firstFilePickerFiles).length;
  });

  click(fileMenu);
  click('.test-add-service-link');
  click(firstFilePicker);

  andThen(function() {
    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 1, 'Added service file');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[3], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });
});

test('can add helper', function(assert){
  assert.expect(3);

  let origFileCount;
  promptValue = 'helpers/my-helper.js';
  visit('/');
  andThen(function(){
    origFileCount = find(firstFilePickerFiles).length;
  });

  click(fileMenu);
  click('.test-add-helper-link');
  click(firstFilePicker);

  andThen(function() {
    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 1, 'Added helper file');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[3], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });
});

test('can add unit test', function(assert){
  assert.expect(3);

  let origFileCount;
  promptValue = 'tests/unit/routes/my-route-test.js';
  visit('/');
  andThen(function(){
    origFileCount = find(firstFilePickerFiles).length;
  });

  click(fileMenu);
  click('.test-add-route-test-link');
  click(firstFilePicker);

  andThen(function() {
    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 3, 'Added 3 test files');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[fileNames.length - 1], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });
});

test('can add integration test', function(assert){
  assert.expect(3);

  let origFileCount;
  promptValue = 'tests/integration/components/my-component-test.js';
  visit('/');
  andThen(function(){
    origFileCount = find(firstFilePickerFiles).length;
  });

  click(fileMenu);
  click('.test-add-component-test-link');
  click(firstFilePicker);

  andThen(function() {
    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 3, 'Added 3 test files');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[fileNames.length - 1], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });
});

test('can add acceptance test', function(assert){
  assert.expect(3);

  let origFileCount;
  promptValue = 'tests/acceptance/my-acceptance-test.js';
  visit('/');
  andThen(function(){
    origFileCount = find(firstFilePickerFiles).length;
  });

  click(fileMenu);
  click('.test-add-acceptance-test-link');
  click(firstFilePicker);

  andThen(function() {
    let numFiles = find(firstFilePickerFiles).length;
    assert.equal(numFiles, origFileCount + 6, 'Added 6 test files');

    let fileNames = findMapText(`${firstFilePickerFiles}  a`);
    assert.equal(fileNames[fileNames.length - 1], promptValue, 'Added the file with the right name');

    let columnFiles = findMapText(displayedFiles);
    assert.ok(columnFiles.includes(promptValue), 'Added file is displayed');
  });
});

test('unsaved indicator', function(assert) {
  const indicator = ".test-unsaved-indicator";

  visit('/');

  andThen(function() {
    assert.equal(find(indicator).length, 0, "Unsaved indicator does not appear when first loading");
  });

  // Below doesn't work in phantomjs:
  if (/PhantomJS/.test(window.navigator.userAgent)) {
    return;
  }

  click(firstColumnTextarea);
  fillIn(firstColumnTextarea, "\"some text\";");
  triggerEvent(firstColumnTextarea, "blur");

  andThen(function() {
    return timeout(10);
  });

  andThen(function() {
    assert.equal(find(indicator).length, 1, "Unsaved indicator reappears after editing");
  });
});

test('editing a file updates gist', function(assert) {
  const files = [
    {
      filename: "templates.application.hbs",
      content: "{{outlet}}"
    }
  ];

  runGist(files);

  andThen(function() {
    promptValue = "templates/index.hbs";
  });

  click(fileMenu);
  click(addTemplateAction);
  click(firstFilePicker);

  andThen(function() {
    assert.equal(find(firstColumnTextarea).val(), "");
  });

  // Below doesn't work in phantomjs:
  if (/PhantomJS/.test(window.navigator.userAgent)) {
    return;
  }

  click("#live-reload");
  click(firstColumnTextarea);
  fillIn(firstColumnTextarea, '<div class="index">some text</div>');
  triggerEvent(firstColumnTextarea, "blur");

  andThen(function() {
    assert.equal(find(firstColumnTextarea).val(), '<div class="index">some text</div>');

    click(".run-now");
    waitForUnloadedIFrame();
    waitForLoadedIFrame();
  });

  andThen(function() {
    assert.equal(outputContents('.index'), 'some text');
  });

});

test('own gist can be copied into a new one', function(assert) {
  // set owner of gist as currently logged in user
  stubValidSession(this.application, {
    currentUser: { login: "Gaurav0" },
    "github-oauth2": {}
  });

  runGist([
    {
      filename: 'application.template.hbs',
      content: 'hello world!'
    }
  ]);

  andThen(function() {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });

  fillIn('.title input', "my twiddle");
  keyEvent('.title input', 'keyup', 13);
  andThen(function() {
    assert.equal(find('.title input').val(), "my twiddle");

    click("#live-reload");
    click('.test-copy-action');
    waitForLoadedIFrame();
  });

  andThen(function() {
    assert.equal(find('.title input').val(), "New Twiddle", "Description is reset");
    assert.equal(find('.test-unsaved-indicator').length, 0, "Unsaved indicator does not appear when gist is copied");
    assert.equal(find('.test-copy-action').length, 0, "Menu item to copy gist is not shown anymore");
    assert.equal(outputContents('div'), 'hello world!');
  });
});

test('accessing /:gist/copy creates a new Twiddle with a copy of the gist', function(assert) {
  runGist([
    {
      filename: 'application.template.hbs',
      content: 'hello world!'
    }
  ]);

  andThen(function() {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });

  fillIn('.title input', "my twiddle");
  andThen(function() {
    assert.equal(find('.title input').val(), "my twiddle");
    assert.equal(find('.test-unsaved-indicator').length, 1, "Changing title triggers unsaved indicator");

    click("#live-reload");
    visit('/35de43cb81fc35ddffb2/copy');
    click(".run-now");
    waitForUnloadedIFrame();
    waitForLoadedIFrame();
  });

  andThen(function() {
    assert.equal(currentURL(), '/');
    assert.equal(find('.title input').val(), "New Twiddle", "Description is reset");
    assert.equal(find('.test-unsaved-indicator').length, 0, "Unsaved indicator does not appear when gist is copied");
    assert.equal(outputContents('div'), 'hello world!');
  });
});
