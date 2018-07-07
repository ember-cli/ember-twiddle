import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import { find, click, visit } from 'ember-native-dom-helpers';

const twiddleMenu = ".test-twiddle-menu";
const menuTrigger = ".ember-basic-dropdown-trigger button";
const deleteGistSelector = '.test-delete-twiddle';

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

  let menu;

  return visit('/35de43cb81fc35ddffb2')
    .then(() => {
      menu = find(twiddleMenu, document.body);
      let el = find(menuTrigger, menu);
      return click(el, menu);
    })
    .then(() => {
      let el = find(deleteGistSelector, menu);
      return click(el, menu);
    })
    .then(() => {
      assert.ok(currentRouteName(), 'gist.new', 'New twiddle created');
    });
});
