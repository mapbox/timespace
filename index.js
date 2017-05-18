var tiles = require('./lib/timezones.json');
var tilebelt = require('tilebelt');
var moment = require('moment-timezone');
var ss = require('simple-statistics');

var z = Object.keys(tiles)[0].split('/').map(Number)[2];

module.exports = {
  getFuzzyLocalTimeFromPoint: getFuzzyLocalTimeFromPoint,
  getFuzzyTimezoneFromTile: getFuzzyTimezoneFromTile,
  getFuzzyTimezoneFromQuadkey: getFuzzyTimezoneFromQuadkey,
  getParent: getParent,
  getChildren: getChildren
};

function getFuzzyLocalTimeFromPoint(timestamp, point) {
  var tile = tilebelt.pointToTile(point[0], point[1], z).join('/');
  var locale = tiles[tile];

  if (locale) return moment.tz(new Date(timestamp), locale);
  else return undefined;
}

function getFuzzyTimezoneFromTile(tile) {
  if (tile[2] === z) {
    var key = tile.join('/');
    if (key in tiles) return tiles[key];
    else throw new Error('tile not found');

  } else if (tile[2] > z) {
    // higher zoom level (9, 10, 11, ...)
    key = getParent(tile).join('/');
    if (key in tiles) return tiles[key];
    else throw new Error('tile not found');

  } else {
    // lower zoom level (..., 5, 6, 7)
    var children = getChildren(tile);
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

function getFuzzyTimezoneFromQuadkey(quadkey) {
  var tile = tilebelt.quadkeyToTile(quadkey);
  return getFuzzyTimezoneFromTile(tile);
}

function getParent(tile) {
  if (tile[2] < z) throw new Error('input tile zoom < ' + z);
  if (tile[2] > z) return getParent(tilebelt.getParent(tile));
  else return tile;
}

function getChildren(tile) {
  if (tile[2] > z) throw new Error('input tile zoom > ' + z);
  if (tile[2] === z) return [tile];

  var children = tilebelt.getChildren(tile);
  return getChildren(children[0])
         .concat(getChildren(children[1]))
         .concat(getChildren(children[2]))
         .concat(getChildren(children[3]));
}
