export default {
  "f2c90713bdfdf54a262b": {
    "url": "https://api.github.com/gists/f2c90713bdfdf54a262b",
    "forks_url": "https://api.github.com/gists/f2c90713bdfdf54a262b/forks",
    "commits_url": "https://api.github.com/gists/f2c90713bdfdf54a262b/commits",
    "id": "f2c90713bdfdf54a262b",
    "git_pull_url": "https://gist.github.com/f2c90713bdfdf54a262b.git",
    "git_push_url": "https://gist.github.com/f2c90713bdfdf54a262b.git",
    "html_url": "https://gist.github.com/f2c90713bdfdf54a262b",
    "files": {
      "controllers.application.js": {
        "filename": "controllers.application.js",
        "type": "application/javascript",
        "language": "JavaScript",
        "raw_url": "https://gist.githubusercontent.com/joostdevries/f2c90713bdfdf54a262b/raw/0d1fcfba8c768e6975b76cc3b0d45ec8add147f6/controllers.application.js",
        "size": 215,
        "truncated": false,
        "content": "import Ember from 'ember';\n\nexport default Ember.Controller.extend({\n  userName: null,\n  prettyUserName: function() {\n    return this.get('userName') ? this.get('userName') : 'everyone';\n  }.property('userName')\n});"
      },
      "styles.app.css": {
        "filename": "styles.app.css",
        "type": "text/css",
        "language": "CSS",
        "raw_url": "https://gist.githubusercontent.com/joostdevries/f2c90713bdfdf54a262b/raw/a465be031fa92e20ee40b62bd897d7a54438528e/styles.app.css",
        "size": 58,
        "truncated": false,
        "content": "body{font-family:Arial; color: #666;}\nh1 {font-size:18px;}"
      },
      "templates.application.hbs": {
        "filename": "templates.application.hbs",
        "type": "text/plain",
        "language": "Handlebars",
        "raw_url": "https://gist.githubusercontent.com/joostdevries/f2c90713bdfdf54a262b/raw/2ef994482c3017b7d55c111f3eabffe0ccc0e1b9/templates.application.hbs",
        "size": 197,
        "truncated": false,
        "content": "<h1>Ember demo for {{controller.prettyUserName}}</h1>\n{{input value=controller.userName  placeholder=\"Your name\"}}\n{{#big-red-text}}All the magic happens in your browser{{/big-red-text}}\n{{outlet}}"
      },
      "templates.components.big-red-text.hbs": {
        "filename": "templates.components.big-red-text.hbs",
        "type": "text/plain",
        "language": "Handlebars",
        "raw_url": "https://gist.githubusercontent.com/joostdevries/f2c90713bdfdf54a262b/raw/6a7e4362a4c413ca329c6687912568389157759a/templates.components.big-red-text.hbs",
        "size": 37,
        "truncated": false,
        "content": "<h1 style=\"color:red;\">{{yield}}</h1>"
      }
    },
    "public": true,
    "created_at": "2015-03-07T18:59:32Z",
    "updated_at": "2015-03-08T12:38:59Z",
    "description": "ember test",
    "comments": 0,
    "user": null,
    "comments_url": "https://api.github.com/gists/f2c90713bdfdf54a262b/comments",
    "owner": {
      "login": "joostdevries",
      "id": 3824616,
      "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/joostdevries",
      "html_url": "https://github.com/joostdevries",
      "followers_url": "https://api.github.com/users/joostdevries/followers",
      "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
      "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
      "organizations_url": "https://api.github.com/users/joostdevries/orgs",
      "repos_url": "https://api.github.com/users/joostdevries/repos",
      "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
      "received_events_url": "https://api.github.com/users/joostdevries/received_events",
      "type": "User",
      "site_admin": false
    },
    "forks": [

    ],
    "history": [
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "8f8e618073eefb57185d7b04a8ba77c6c38ec7a4",
        "committed_at": "2015-03-08T12:38:59Z",
        "change_status": {
          "total": 3,
          "additions": 2,
          "deletions": 1
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/8f8e618073eefb57185d7b04a8ba77c6c38ec7a4"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "1c9e654d81c77e1d69d6275526f36baf46ef320e",
        "committed_at": "2015-03-08T12:38:33Z",
        "change_status": {
          "total": 2,
          "additions": 1,
          "deletions": 1
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/1c9e654d81c77e1d69d6275526f36baf46ef320e"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "3e3932b7123c4c725735efde37c950a8a434212f",
        "committed_at": "2015-03-08T12:37:44Z",
        "change_status": {
          "total": 2,
          "additions": 1,
          "deletions": 1
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/3e3932b7123c4c725735efde37c950a8a434212f"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "f6a4828b7c8754228e328cd5f452b2d693550be0",
        "committed_at": "2015-03-08T12:37:24Z",
        "change_status": {
          "total": 2,
          "additions": 1,
          "deletions": 1
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/f6a4828b7c8754228e328cd5f452b2d693550be0"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "2620f9431aa263570032e6cec442c5cc2dc52820",
        "committed_at": "2015-03-08T12:37:08Z",
        "change_status": {
          "total": 10,
          "additions": 7,
          "deletions": 3
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/2620f9431aa263570032e6cec442c5cc2dc52820"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "b53dd94a89905ba3275f65a84d5cd18f17febbb1",
        "committed_at": "2015-03-08T12:32:58Z",
        "change_status": {
          "total": 2,
          "additions": 1,
          "deletions": 1
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/b53dd94a89905ba3275f65a84d5cd18f17febbb1"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "0f131407081d3f07dca65c372914e92a3f484a1b",
        "committed_at": "2015-03-08T12:27:56Z",
        "change_status": {
          "total": 1,
          "additions": 1,
          "deletions": 0
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/0f131407081d3f07dca65c372914e92a3f484a1b"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "16e4ca860538ead8c923ef9149e96f95ae75dbb7",
        "committed_at": "2015-03-07T21:22:12Z",
        "change_status": {
          "total": 2,
          "additions": 2,
          "deletions": 0
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/16e4ca860538ead8c923ef9149e96f95ae75dbb7"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "15e47eed8465ddae11e75b712b14b3db1f0cf3f2",
        "committed_at": "2015-03-07T20:49:40Z",
        "change_status": {
          "total": 2,
          "additions": 1,
          "deletions": 1
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/15e47eed8465ddae11e75b712b14b3db1f0cf3f2"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "e6dd1ad34bf416b67b410e5e3f64c61fcc94c11e",
        "committed_at": "2015-03-07T20:49:09Z",
        "change_status": {
          "total": 2,
          "additions": 1,
          "deletions": 1
        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/e6dd1ad34bf416b67b410e5e3f64c61fcc94c11e"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "dc23368796eabf2a25318421d72549ae5dd22f7c",
        "committed_at": "2015-03-07T19:05:06Z",
        "change_status": {

        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/dc23368796eabf2a25318421d72549ae5dd22f7c"
      },
      {
        "user": {
          "login": "joostdevries",
          "id": 3824616,
          "avatar_url": "https://avatars.githubusercontent.com/u/3824616?v=3",
          "gravatar_id": "",
          "url": "https://api.github.com/users/joostdevries",
          "html_url": "https://github.com/joostdevries",
          "followers_url": "https://api.github.com/users/joostdevries/followers",
          "following_url": "https://api.github.com/users/joostdevries/following{/other_user}",
          "gists_url": "https://api.github.com/users/joostdevries/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/joostdevries/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/joostdevries/subscriptions",
          "organizations_url": "https://api.github.com/users/joostdevries/orgs",
          "repos_url": "https://api.github.com/users/joostdevries/repos",
          "events_url": "https://api.github.com/users/joostdevries/events{/privacy}",
          "received_events_url": "https://api.github.com/users/joostdevries/received_events",
          "type": "User",
          "site_admin": false
        },
        "version": "e5eca1221a3fa73ebcdb6a9e766472b59b7ac11b",
        "committed_at": "2015-03-07T18:59:32Z",
        "change_status": {

        },
        "url": "https://api.github.com/gists/f2c90713bdfdf54a262b/e5eca1221a3fa73ebcdb6a9e766472b59b7ac11b"
      }
    ]
  }
};
