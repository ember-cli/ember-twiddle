/**
 * This is a factory definition for an owner
 */
import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  id: faker.random.number(99999),
  avatar_url() {
    return `https://avatars.githubusercontent.com/u/${this.id}?v=3`;
  },
  gravatar_id: "",
  url() {
    return "https://api.github.com/users/" + this.login;
  },
  html_url() {
    return "https://github.com/" + this.login;
  },
  followers_url() {
    return `https://api.github.com/users/${this.login}/followers`;
  },
  following_url() {
    return `https://api.github.com/users/${this.login}/following{/other_user}`;
  },
  gists_url() {
    return `https://api.github.com/users/${this.login}/gists{/gist_id}`;
  },
  starred_url() {
    return `https://api.github.com/users/${this.login}/starred{/owner}{/repo}`;
  },
  subscriptions_url() {
    return `https://api.github.com/users/${this.login}/subscriptions`;
  },
  organizations_url() {
    return `https://api.github.com/users/${this.login}/orgs`;
  },
  repos_url() {
    return `https://api.github.com/users/${this.login}/repos`;
  },
  events_url() {
    return `https://api.github.com/users/${this.login}/events{/privacy}`;
  },
  received_events_url() {
    return `https://api.github.com/users/${this.login}/received_events`;
  },
  type: "User",
  site_admin: false
});

/* Sample
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
 */
