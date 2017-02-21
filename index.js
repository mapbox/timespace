var tiles = require('./lib/timezones.json');
var tilebelt = require('tilebelt');
var moment = require('moment-timezone');

var z = 8;

module.exports = {
  getFuzzyLocalTimeFromPoint: getFuzzyLocalTimeFromPoint,
  getFuzzyTimezoneFromTile: getFuzzyTimezoneFromTile,
  getFuzzyTimezoneFromQuadkey: getFuzzyTimezoneFromQuadkey,
  getz8Parent: getz8Parent
};

function getFuzzyLocalTimeFromPoint(timestamp, point) {
  var tile = tilebelt.pointToTile(point[0], point[1], z).join('/');
  var locale = tiles[tile];

  return moment.tz(new Date(timestamp), locale).format();
}

function getFuzzyTimezoneFromTile(tile) {
  if (tile[2] > 8) tile = getz8Parent(tile);
  var key = tile.join('/');
  if (key in tiles) return tiles[key];
  else throw new Error('tile not found');
}

function getFuzzyTimezoneFromQuadkey(quadkey) {
  if (quadkey.length < 8)
    throw new Error('currently not supporting zoom level < 8');
  else if (quadkey.length > 8)
    quadkey = quadkey.slice(0, 8);

  var tile = tilebelt.quadkeyToTile(quadkey);
  return getFuzzyTimezoneFromTile(tile);
}

function getz8Parent(tile) {
  if (tile[2] > 8) return getz8Parent(tilebelt.getParent(tile));
  else return tile;
}
