var tiles = require('./lib/timezones.json');
var tilebelt = require('tilebelt');
var moment = require('moment-timezone');
var ss = require('simple-statistics');

var z = Object.keys(tiles)[0].split('/').map(Number)[2];

module.exports = {
  getFuzzyLocalTimeFromPoint: getFuzzyLocalTimeFromPoint,
  getFuzzyTimezoneFromTile: getFuzzyTimezoneFromTile,
  getFuzzyTimezoneFromQuadkey: getFuzzyTimezoneFromQuadkey,
  _getParent: _getParent,      // expose for testing
  _getChildren: _getChildren   // expose for testing
};

/**
 * Returns the local time at the point of interest.
 * @param  {Integer} timestamp   a unix timestamp
 * @param  {Array}   point       a [lng, lat] point of interest
 * @return {Object}              a moment-timezone object
 */
function getFuzzyLocalTimeFromPoint(timestamp, point) {
  var tile = tilebelt.pointToTile(point[0], point[1], z).join('/');
  var locale = tiles[tile];

  if (locale) return moment.tz(new Date(timestamp), locale);
  else return undefined;
}

/**
 * Retrieves the timezone of the tile of interest at z8-level accuracy.
 * @param  {Array}  tile   [x, y, z] coordinate of a tile
 * @return {String}        timezone for the tile
 */
function getFuzzyTimezoneFromTile(tile) {
  if (tile[2] === z) {
    var key = tile.join('/');
    if (key in tiles) return tiles[key];
    else throw new Error('tile not found');

  } else if (tile[2] > z) {
    // higher zoom level (9, 10, 11, ...)
    key = _getParent(tile).join('/');
    if (key in tiles) return tiles[key];
    else throw new Error('tile not found');

  } else {
    // lower zoom level (..., 5, 6, 7)
    var children = _getChildren(tile);
    var votes = [];  // list of timezone abbrevations
    var abbrs = {};  // abbrevation to full name lookup table
    children.forEach(function(child) {
      key = child.join('/');
      if (key in tiles) {
        var tz = tiles[key];   // timezone name

        // Need to use timezone abbreviation becuase e.g. America/Los_Angeles
        // and America/Vancouver are the same. Use a time to determine the
        // abbreviation, in case two similar tz have slightly different
        // daylight savings schedule.
        var abbr = moment.tz(Date.now(), tz)._z.abbrs[0];
        votes.push(abbr);
        abbrs[abbr] = tz;
      }
    });

    if (votes.length > 1) return abbrs[ss.mode(votes)];
    else throw new Error('tile not found');
  }
}

/**
 * Retrieves the timezone of the quadkey of interest at z8-level accuracy.
 * @param  {Array}  quadkey   a quadkey
 * @return {String}           timezone for the quadkey
 */
function getFuzzyTimezoneFromQuadkey(quadkey) {
  var tile = tilebelt.quadkeyToTile(quadkey);
  return getFuzzyTimezoneFromTile(tile);
}

/**
 * [private function]
 */
function _getParent(tile) {
  if (tile[2] < z) throw new Error('input tile zoom < ' + z);
  if (tile[2] > z) return _getParent(tilebelt.getParent(tile));
  else return tile;
}

/**
 * [private function]
 */
function _getChildren(tile) {
  if (tile[2] > z) throw new Error('input tile zoom > ' + z);
  if (tile[2] === z) return [tile];

  var children = tilebelt.getChildren(tile);
  return _getChildren(children[0])
         .concat(_getChildren(children[1]))
         .concat(_getChildren(children[2]))
         .concat(_getChildren(children[3]));
}
