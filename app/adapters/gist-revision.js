import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery: function(query) {
    const host = this.host || "";
    return `${host}/gists/${query.gistId}/${query.revId}`;
  }
});
