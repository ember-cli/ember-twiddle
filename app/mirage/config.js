export default function() {}

/*
 * Only loaded during tests
 */
export function testConfig() {

  this.get('/gists/:id', function(db, request) {
    let id = request.params.id;
    return db.gists.find(id);
  });
}
