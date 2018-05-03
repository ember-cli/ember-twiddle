import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';
import Mirage from 'ember-cli-mirage';
import { find, findAll, click, visit } from 'ember-native-dom-helpers';
import { resolve } from 'rsvp';

const twiddleMenu = ".test-twiddle-menu";
const menuTrigger = ".ember-basic-dropdown-trigger button";
const forkTwiddleSelector = '.test-fork-twiddle';

moduleForAcceptance('Acceptance | fork gist', {
  beforeEach: function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;
    server.create('user', { login: 'octocat' });

    server.post('/gists/:id/forks', () => {
      let gist = server.create('gist', { id: 'bd9d8d69-a674-4e0f-867c-c8796ed151a0' });
      return new Mirage.Response(200, {}, gist);
    });
  },

  afterEach: function() {
    window.confirm = this.cacheConfirm;
  }
});

test('can fork a gist', function(assert) {
  // set owner of gist as currently logged in user
  stubValidSession(this.application, {
    currentUser: {login: "octocat"},
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
      assert.equal(findAll('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
      return resolve();
    })
    .then(() => {
      menu = find(twiddleMenu, document.body);
      let el = find(menuTrigger, menu);
      return click(el, document.body);
    })
    .then(() => {
      let el = find(forkTwiddleSelector, document.body);
      return click("button", el);
    })
    .then(() => {
      assert.equal(findAll('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");

      let url = currentURL();
      let route = url.substr(url.lastIndexOf('/'));
      assert.equal(route, '/bd9d8d69-a674-4e0f-867c-c8796ed151a0');

      return resolve();
    });
});
