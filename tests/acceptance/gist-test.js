import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-twiddle/tests/helpers/start-app';

let application;
let cacheConfirm;

const firstFilePicker = '.code:first-of-type .dropdown-toggle';
const secondFile = '.code:first-of-type .dropdown-menu li:nth-child(2) a';
const anyFile = '.code:first-of-type .dropdown-menu li:nth-child(1) a';
const fileMenu = '.file-menu .dropdown-toggle';
// const firstColumn = '.code:first-of-type';
const deleteAction = '.file-menu a:contains(Delete)';

module('Acceptance | gist', {
  beforeEach: function() {
    application = startApp();
    cacheConfirm = window.confirm;
    window.confirm = () => true;
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

    click(firstFilePicker);
    click(anyFile);
    click(fileMenu);
    click(deleteAction);

    click(firstFilePicker);
    click(anyFile);
    click(fileMenu);
    click(deleteAction);

    click(firstFilePicker);
    click(anyFile);
    click(fileMenu);
    click(deleteAction);

    andThen(function() {
      assert.equal(find('a:contains(No files available)').length, 4, 'Shows message when all files are removed.');
    });
  });
});
