import AddonFixture from "./fixtures/addon";
import config from "../config/environment";
import Mirage, { faker } from "ember-cli-mirage";

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

  this.post('/gists', function(schema, request) {
    let gist = server.create('gist', { id: faker.random.uuid() });
    let response = Ember.assign(gist, JSON.parse(request.requestBody));
    return new Mirage.Response(200, {}, response);
  });

  this.patch('/gists/:id', (schema, request) => {
    let response = JSON.parse(request.requestBody);
    response.id = request.params.id;
    return new Mirage.Response(200, {}, response);
  });

  this.post('/gists/:id/forks', function(schema, request) {
    let gist = server.create('gist', { id: faker.random.uuid() });
    return new Mirage.Response(200, {}, gist);
  });

  this.delete('/gists/:id', () => {
    return new Mirage.Response(204);
  });

  this.get('/user', function(schema) {
    return schema.db.users.find(1);
  });

  this.get(config.addonUrl, function() {
    return AddonFixture;
  });
}
