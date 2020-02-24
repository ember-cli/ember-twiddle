import $ from 'jquery';
import { findAll } from '@ember/test-helpers';

export function findMapText(selector) {
  var match = findAll(selector);
  var map = new Array(match.length);
  for (var i=0, l=map.length; i<l; i++) {
    map[i] = $(match[i]).text().trim();
  }
  return map;
}
