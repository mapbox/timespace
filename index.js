var tiles = require('./lib/timezones.json');
var tilebelt = require('tilebelt');
var moment = require('moment-timezone');

var z = 7;

module.exports = {
  getFuzzyLocalTimeFromPoint: getFuzzyLocalTimeFromPoint,
  getFuzzyTimezoneFromTile: getFuzzyTimezoneFromTile,
  getFuzzyTimezonFromQuadkey: getFuzzyTimezoneFromQuadkey
};

function getFuzzyLocalTimeFromPoint(timestamp, point) {
  var tile = tilebelt.pointToTile(point[0], point[1], z).join('/');
  var locale = tiles[tile];

  return moment.tz(new Date(timestamp), locale).format();
}

function getFuzzyTimezoneFromTile(tile) {
  var key = tile.join('/');
  if (key in tiles) return tiles[key];
  else throw new Error('tile not found');
}

function getFuzzyTimezoneFromQuadkey(quadkey) {
  if (quadkey.length < 7)
    throw new Error('currently not supporting zoom level < 7');
  else if (quadkey.length > 7)
    quadkey = quadkey.slice(0, 7);

  var tile = tilebelt.quadkeyToTile(quadkey);
  return getFuzzyTimezoneFromTile(tile);
}
