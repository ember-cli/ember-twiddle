import AddonFixture from "./fixtures/addon";
import config from "../config/environment";

export default function() {}

/*
 * Only loaded during tests
 */
export function testConfig() {

  this.get('/gists', function(schema) {
    return schema.db.gists;
  });

  this.get('/gists/:id', function(schema, request) {
    let id = request.params.id;
    return schema.db.gists.find(id);
  });

  this.get('/gists/:id/:rev_id', function(schema, request) {
    let id = request.params.id;
    return schema.db["gistRevisions"].find(id);
  });

  this.get('/user', function(schema) {
    return schema.db.users.find(1);
  });

  this.get(config.addonUrl, function() {
    return AddonFixture;
  });
}
