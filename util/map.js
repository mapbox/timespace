/**
 * USE:
 *   node map.js | tippecanoe -z8 -f -o zones.mbtiles
 */

var path = require('path');
var cover = require('tile-cover');
var tilebelt = require('tilebelt');
var turf = require('turf');

var timezones = require('../lib/timezones.json');

var fc = turf.featurecollection([]);

Object.keys(timezones).forEach(function(timezone){
  var poly = turf.polygon(tilebelt.tileToGeoJSON(timezone.split('/').map(Number)).coordinates);
  poly.properties.zone = timezones[timezone]
  console.log(JSON.stringify(poly))
});