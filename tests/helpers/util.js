export function findMapText(selector, context) {
  var match = find(selector, context);
  var map = new Array(match.length);
  for (var i=0, l=map.length; i<l; i++) {
    map[i] = $(match[i]).text().trim();
  }
  return map;
}
