import Oauth2 from 'torii/providers/oauth2-code';
import {configurable} from 'torii/configuration';

/**
* This class implements authentication against Github Enterprise
* using the OAuth2 authorization flow in a popup window.
* It is based on the github-oauth2 provider in the torii project
* @class
*/
var GithubEnterprse = Oauth2.extend({
  name: 'github-enterprise',
  baseUrl: configurable('baseUrl', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  }),

  responseParams: ['code', 'state'],

  redirectUri: configurable('redirectUri', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  })
});

export default GithubEnterprse;
