/**
 * This is a factory definition for a gist.
 */
import Mirage/*, {faker} */ from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  url() {
    return "https://api.github.com/gists/" + this.id;
  },
  forks_url() {
    return `https://api.github.com/gists/${this.id}/forks`;
  },
  commits_url() {
    return `https://api.github.com/gists/${this.id}/commits`;
  },
  git_pull_url() {
    return `https://gist.github.com/${this.id}.git`;
  },
  git_push_url() {
    return `https://gist.github.com/${this.id}.git`;
  },
  html_url() {
    return "https://gist.github.com/" + this.id;
  },
  //files,
  public: true,
  created_at: "2015-07-23T22:30:30Z",
  updated_at: "2015-07-23T22:49:45Z",
  description: "New Twiddle",
  comments: 0,
  user: null,
  comments_url() {
    return `https://api.github.com/gists/${this.id}/comments`;
  },
  //owner,
  forks: [],
  history: [
    {
      "user": null,
      "version": "921e8958fe32b5a1b724fa6754d0dd904cfa9e62",
      "committed_at": "2015-07-23T22:49:45Z",
      "url": `https://api.github.com/gists/${this.id}/921e8958fe32b5a1b724fa6754d0dd904cfa9e62`
    }
  ]
});

/* Sample
{
  "url": "https://api.github.com/gists/35de43cb81fc35ddffb2",
  "forks_url": "https://api.github.com/gists/35de43cb81fc35ddffb2/forks",
  "commits_url": "https://api.github.com/gists/35de43cb81fc35ddffb2/commits",
  "id": "35de43cb81fc35ddffb2",
  "git_pull_url": "https://gist.github.com/35de43cb81fc35ddffb2.git",
  "git_push_url": "https://gist.github.com/35de43cb81fc35ddffb2.git",
  "html_url": "https://gist.github.com/35de43cb81fc35ddffb2",
  "files": {
  "about.template.hbs": {
    "filename": "about.template.hbs",
      "type": "text/plain",
      "language": "Handlebars",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/b7332edd46bd97973c1dfebf495908b8abb9b301/about.template.hbs",
      "size": 17,
      "truncated": false,
      "content": "<p>About Page</p>"
  },
  "application.template.hbs": {
    "filename": "application.template.hbs",
      "type": "text/plain",
      "language": "Handlebars",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/f354c6698b02fe3243656c8dc5aa0303cc7ae81c/application.template.hbs",
      "size": 87,
      "truncated": false,
      "content": "{{#link-to \"index\"}}Index{{/link-to}}\n{{#link-to \"about\"}}About{{/link-to}}\n\n{{outlet}}"
  },
  "index.template.hbs": {
    "filename": "index.template.hbs",
      "type": "text/plain",
      "language": "Handlebars",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/60a449a6591c3bd2ba7389354146c264b13c3166/index.template.hbs",
      "size": 16,
      "truncated": false,
      "content": "<p>Main Page</p>"
  },
  "router.js": {
    "filename": "router.js",
      "type": "application/javascript",
      "language": "JavaScript",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/0ef881458f8154407d50509be3598b31392d8153/router.js",
      "size": 218,
      "truncated": false,
      "content": "import Ember from 'ember';\nimport config from './config/environment';\n\nvar Router = Ember.Router.extend({\n  location: config.locationType\n});\n\nRouter.map(function() {\n  this.route(\"about\");\n});\n\nexport default Router;\n"
  },
  "twiddle.json": {
    "filename": "twiddle.json",
      "type": "application/json",
      "language": "JSON",
      "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/8b44c317f1c80721a3a74f542ca0c55a01a5badf/twiddle.json",
      "size": 303,
      "truncated": false,
      "content": "{\n  \"version\": \"0.4.0\",\n  \"dependencies\": {\n    \"jquery\": \"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js\",\n    \"ember\": \"https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.5/ember.js\",\n    \"ember-data\": \"https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.5/ember-data.js\"\n  }\n}"
  }
},
  "public": true,
  "created_at": "2015-07-23T22:30:30Z",
  "updated_at": "2015-07-23T22:49:45Z",
  "description": "New Twiddle",
  "comments": 0,
  "user": null,
  "comments_url": "https://api.github.com/gists/35de43cb81fc35ddffb2/comments",
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
    "version": "921e8958fe32b5a1b724fa6754d0dd904cfa9e62",
    "committed_at": "2015-07-23T22:49:45Z",
    "change_status": {
      "total": 1,
      "additions": 1,
      "deletions": 0
    },
    "url": "https://api.github.com/gists/35de43cb81fc35ddffb2/921e8958fe32b5a1b724fa6754d0dd904cfa9e62"
  },
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
    "version": "e0c766099ae77ceaa4fafc0a61f536b469fe4840",
    "committed_at": "2015-07-23T22:48:50Z",
    "change_status": {
      "total": 1,
      "additions": 1,
      "deletions": 0
    },
    "url": "https://api.github.com/gists/35de43cb81fc35ddffb2/e0c766099ae77ceaa4fafc0a61f536b469fe4840"
  },
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
    "version": "b42740fa0ee5b3af9ef29c005b10906932dad930",
    "committed_at": "2015-07-23T22:30:30Z",
    "change_status": {
      "total": 24,
      "additions": 24,
      "deletions": 0
    },
    "url": "https://api.github.com/gists/35de43cb81fc35ddffb2/b42740fa0ee5b3af9ef29c005b10906932dad930"
  }
]
}
*/



