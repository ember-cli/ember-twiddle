import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery: function(query) {
    const host = this.host || "";
    if (query.user) {
      return `${host}/users/${query.user}/gists`;
    } else {
      return `${host}/gists`;
    }
  }
});
