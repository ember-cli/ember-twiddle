import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery: function(query) {
    console.log(query);
    return `${this.host}/gists/${query.gistId}/${query.revId}`;
  }
});
