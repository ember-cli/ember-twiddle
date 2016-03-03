/**
 * This is a factory definition for a gist revision.
 */
import GistFactory from './gist';

export default GistFactory.extend({
  url() {
    return `https://api.github.com/gists/${this.id}/${this.revId}`;
  }
});

/* Sample
{
  "url": "https://api.github.com/gists/a9d365962ab98c2e12cd/3421e6dde701325b5da67ba06dc150b7ad7e0547",
  "forks_url": "https://api.github.com/gists/a9d365962ab98c2e12cd/forks",
  "commits_url": "https://api.github.com/gists/a9d365962ab98c2e12cd/commits",
  "id": "a9d365962ab98c2e12cd",
  "git_pull_url": "https://gist.github.com/a9d365962ab98c2e12cd.git",
  "git_push_url": "https://gist.github.com/a9d365962ab98c2e12cd.git",
  "html_url": "https://gist.github.com/a9d365962ab98c2e12cd",
  "files": {
    "application.controller.js": {
      "filename": "application.controller.js",
      "type": "application/javascript",
      "language": "JavaScript",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/a9d365962ab98c2e12cd/raw/a5591f634f02783af0de26c2a0799e2a6c2deb1d/application.controller.js",
      "size": 247,
      "truncated": false,
      "content": "import Ember from 'ember';\nimport JsonProxy from '../json-proxy';\n\nexport default Ember.Controller.extend({\n  appName: 'Ember Twiddle',\n  \n  init(...args) {\n      this._super(...args);\n      this.set('somevar', JsonProxy.build([1, 2, 3]));\n\t}\n});\n"
    },
    "application.template.hbs": {
      "filename": "application.template.hbs",
      "type": "text/plain",
      "language": "Handlebars",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/a9d365962ab98c2e12cd/raw/95de1498ec47fced63bb38e5a2ec69ef9f1620a5/application.template.hbs",
      "size": 108,
      "truncated": false,
      "content": "<h1>Welcome to {{appName}}</h1>\n<br>\n<ul>\n{{#each somevar as |num|}}\n  <li>{{num}}</li>\n{{/each}}\n</ul>\n<br>"
    },
    "json-proxy.js": {
      "filename": "json-proxy.js",
      "type": "application/javascript",
      "language": "JavaScript",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/a9d365962ab98c2e12cd/raw/7f218e6a2788227292b99fca84772fb4885a3287/json-proxy.js",
      "size": 188,
      "truncated": false,
      "content": "import Ember from \"ember\";\n\nvar JsonProxy = Ember.ArrayProxy.extend({});\nJsonProxy.build = function(ary) {\n  return Ember.ArrayProxy.create({ content: ary });\n};\n\nexport default JsonProxy;"
    },
    "twiddle.json": {
      "filename": "twiddle.json",
      "type": "application/json",
      "language": "JSON",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/a9d365962ab98c2e12cd/raw/87a00ec9acd16432438a70288db99b87371a9aeb/twiddle.json",
      "size": 511,
      "truncated": false,
      "content": "{\n  \"version\": \"0.6.0\",\n  \"EmberENV\": {\n    \"FEATURES\": {}\n  },\n  \"options\": {\n    \"enable-testing\": false\n  },\n  \"dependencies\": {\n    \"jquery\": \"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js\",\n    \"ember\": \"https://cdnjs.cloudflare.com/ajax/libs/ember.js/2.3.1/ember.debug.js\",\n    \"ember-data\": \"https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/2.3.3/ember-data.js\",\n    \"ember-template-compiler\": \"https://cdnjs.cloudflare.com/ajax/libs/ember.js/2.2.0/ember-template-compiler.js\"\n  }\n}\n"
    }
  },
  "public": true,
  "created_at": "2016-02-25T22:26:03Z",
  "updated_at": "2016-02-25T22:28:29Z",
  "description": "JsonProxy",
  "comments": 0,
  "user": null,
  "comments_url": "https://api.github.com/gists/a9d365962ab98c2e12cd/comments",
  "owner": {
  "login": "Gaurav0",
  "id": 313960,
  "avatar_url": "https://avatars.githubusercontent.com/u/313960?v=3",
  "gravatar_id": "",
  "url": "https://api.github.com/users/Gaurav0",
  "html_url": "https://github.com/Gaurav0",
  "followers_url": "https://api.github.com/users/Gaurav0/followers",
  "following_url": "https://api.github.com/users/Gaurav0/following{/other_user}",
  "gists_url": "https://api.github.com/users/Gaurav0/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/Gaurav0/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/Gaurav0/subscriptions",
  "organizations_url": "https://api.github.com/users/Gaurav0/orgs",
  "repos_url": "https://api.github.com/users/Gaurav0/repos",
  "events_url": "https://api.github.com/users/Gaurav0/events{/privacy}",
  "received_events_url": "https://api.github.com/users/Gaurav0/received_events",
  "type": "User",
  "site_admin": false
  },
  "forks": [

  ],
  "history": [
    {
      "user": {
      "login": "Gaurav0",
      "id": 313960,
      "avatar_url": "https://avatars.githubusercontent.com/u/313960?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/Gaurav0",
      "html_url": "https://github.com/Gaurav0",
      "followers_url": "https://api.github.com/users/Gaurav0/followers",
      "following_url": "https://api.github.com/users/Gaurav0/following{/other_user}",
      "gists_url": "https://api.github.com/users/Gaurav0/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/Gaurav0/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/Gaurav0/subscriptions",
      "organizations_url": "https://api.github.com/users/Gaurav0/orgs",
      "repos_url": "https://api.github.com/users/Gaurav0/repos",
      "events_url": "https://api.github.com/users/Gaurav0/events{/privacy}",
      "received_events_url": "https://api.github.com/users/Gaurav0/received_events",
      "type": "User",
      "site_admin": false
    },
    "version": "3421e6dde701325b5da67ba06dc150b7ad7e0547",
    "committed_at": "2016-02-25T22:26:03Z",
    "change_status": {
      "total": 42,
      "additions": 42,
      "deletions": 0
    },
    "url": "https://api.github.com/gists/a9d365962ab98c2e12cd/3421e6dde701325b5da67ba06dc150b7ad7e0547"
    }
  ],
  "truncated": false
}

*/



