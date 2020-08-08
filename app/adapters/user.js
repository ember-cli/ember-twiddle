import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindRecord(id, typeKey) {
    // Github no longer lets you query for another user by id
    // requires you to use user's login name
    // but I never was actually doing so
    // so this code now assumes that always querying for current user
    // Gaurav - 8/8/20

    let url = this._buildURL(typeKey);
    return url.substring(0, url.length-1);
  }
});
