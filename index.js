var tiles = require('./lib/timezones.json');
var tilebelt = require('tilebelt');
var moment = require('moment-timezone');
var ss = require('simple-statistics');

var z = 8;

module.exports = {
  getFuzzyLocalTimeFromPoint: getFuzzyLocalTimeFromPoint,
  getFuzzyTimezoneFromTile: getFuzzyTimezoneFromTile,
  getFuzzyTimezoneFromQuadkey: getFuzzyTimezoneFromQuadkey,
  getz8Parent: getz8Parent,
  getz8Children: getz8Children
};

function getFuzzyLocalTimeFromPoint(timestamp, point) {
  var tile = tilebelt.pointToTile(point[0], point[1], z).join('/');
  var locale = tiles[tile];

  return moment.tz(new Date(timestamp), locale);
}

function getFuzzyTimezoneFromTile(tile) {
  if (tile[2] === z) {
    // zoom level = 8
    var key = tile.join('/');
    if (key in tiles) return tiles[key];
    else throw new Error('tile not found');

  } else if (tile[2] > z) {
    // higher zoom level (9, 10, 11, ...)
    key = getz8Parent(tile).join('/');
    if (key in tiles) return tiles[key];
    else throw new Error('tile not found');

  } else {
    // lower zoom level (..., 5, 6, 7)
    var children = getz8Children(tile);
    var votes = [];  // list of timezone abbrevations
    var abbrs = {};  // abbrevation to full name lookup table
    children.forEach(function(child) {
      key = child.join('/');
      if (key in tiles) {
        var tz = tiles[key];   // timezone name
        var abbr = moment.tz(Date.now(), tz)._z.abbrs[0]; // timezone abbreviation
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

function getz8Parent(tile) {
  if (tile[2] < z) throw new Error('input tile zoom < 8');
  if (tile[2] > z) return getz8Parent(tilebelt.getParent(tile));
  else return tile;
}

function getz8Children(tile) {
  if (tile[2] > 8) throw new Error('input tile zoom > 8');
  if (tile[2] === z) return [tile];

  var children = tilebelt.getChildren(tile);
  return getz8Children(children[0])
         .concat(getz8Children(children[1]))
         .concat(getz8Children(children[2]))
         .concat(getz8Children(children[3]));
}
