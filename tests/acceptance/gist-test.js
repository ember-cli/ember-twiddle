import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

let application;
let cacheConfirm;

const firstFilePicker = '.code:first-of-type .dropdown-toggle';
const secondFile = '.code:first-of-type .dropdown-menu li:nth-child(2) a';
const anyFile = '.code:first-of-type .dropdown-menu li:nth-child(1) a';
const fileMenu = '.file-menu .dropdown-toggle';
//const firstColumn = '.code:first-of-type';
const deleteAction = '.file-menu a:contains(Delete)';
const addTemplateAction = '.test-template-action';
const firstFilePickerFiles = '.code:first-of-type .dropdown-menu>li';

let promptValue = '';

module('Acceptance | gist', {
  beforeEach: function() {
    application = startApp();
    cacheConfirm = window.confirm;
    window.confirm = () => true;
    window.prompt = () => promptValue;
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
    window.confirm = cacheConfirm;
  }
});

test('deleting a gist loaded in two columns', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'We are on the correct route');
    click(firstFilePicker);
    click(secondFile);
    click(firstFilePicker);
    click(fileMenu);
    click(deleteAction);
    andThen(function() {
      assert.equal(find('.code .CodeMirror').length, 0, 'No code mirror editors active');
      assert.equal(find('.dropdown-toggle:contains(No file selected)').length, 2, 'Shows message when no file is selected.');
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
