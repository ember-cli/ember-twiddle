import Ember from 'ember';
import ajax from 'ic-ajax';

import Gist from '../lib/gist';

export default Ember.Object.extend({
  _token: null,

  setToken (token) {
    this.set('_token', token);
  },

  /**
   * Top-level method to find a gist by ID
   * @param  id
   * @return {Promise} resolving to a {Gist}
   */
  findGist (id) {
    return this.request('/gists/%@'.fmt(id), 'get').then((payload) => {
      return Gist.deserialize(payload);
    });
  },

  /**
   * Create a new {Gist} instance
   * @param {Object} Arguments
   * @return {Gist}
   */
  createGist (attrs) {
    return Gist.build(attrs);
  },

  /**
   * Saves the current gist
   * @return Promise
   */
  saveGist (gist) {
    return gist.get('isNew') ? this.postGist(gist) : this.patchGist(gist);
  },

  // Lower level API

  /**
   * Create a new {Gist} instance
   * @param {Object} Arguments
   * @return {Gist}
   */
  buildGist (attrs) {
    attrs = attrs || {};
    attrs['files'] = [];
    return Gist.create(attrs);
  },
  /**
   * Post a gist (creating a new gist)
   * @param  gist
   * @return {Promise} resolving to a {Gist}
   */
  postGist (gist) {
    var payload = gist.serialize();
    return this.request('/gists/', 'post', payload);
  },

  /**
   * Patch a gist (updating an existing gist)
   * @param  gist
   * @return {Promise} resolving to a {Gist}
   */
  patchGist (gist) {
    var payload = gist.serialize();
    return this.request('/gists/%@'.fmt(gist.get('id')), 'patch', payload);
  },

  /**
   * Send a request to the github API
   * @param  {String} url
   * @param  {String} method
   * @param  {Object} payload
   * @return {Promise}
   */
  request (url, method) {
    var token = this.get('_token');

    return ajax({
      url: 'https://api.github.com' + url,
      dataType: 'json',
      method: method,
      headers: {
        'Authorization': 'token ' + token
      },
    });
  }
});