/**
 * Qunatize timezone.
 *
 * USE:
 *   node quantize.js 8   # fuzzy z8 timezones
 */

var fs = require('fs');
var path = require('path');
var cover = require('tile-cover');
var tilebelt = require('@mapbox/tilebelt');
var turf = require('turf');
var d3 = require('d3-queue');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var moment = require('moment-timezone');
var zlib = require('zlib');
var z = +process.argv[2];

// for tracking progress
var zonesDone = 0;
var totalZones = 0;

var tiles = {};
var tzNames = {};


// load timezone polygons
var timezoneBuffer = fs.readFileSync(path.join(__dirname, '../timezones.geojson.gz'));
zlib.gunzip(timezoneBuffer, function(err, data) {
  if (err) throw err;


  zones = JSON.parse(data);

  zones = zones.features.filter(function(zone) {
    return moment.tz.zone(zone.properties.tzid) !== null;
  });
  totalZones = zones.length;
  console.info('No. of timezones:', totalZones);


  // find which z7 tiles these these zones cover
  var q = d3.queue();
  zones.forEach(function(zone) {
    q.defer(coverTile, zone)
  });

  // output {tile: timezone}
  q.awaitAll(function (err) {
    if (err) {
      console.error(err)
      throw err;
    }

    Object.keys(tiles).forEach(function(tile) {
      tiles[tile] = tiles[tile].name;
    });

    fs.writeFileSync(path.join(__dirname, '../lib/timezones.json'), JSON.stringify(tiles));
  });

});


function coverTile(zone, done) {
  if (zone.properties.tzid.toLowerCase().includes('antarctica') || zone.properties.tzid.toLowerCase().includes('etc')) {
    done();
    console.info(`Ignored zone: ${zone.properties.tzid}`);
    return;
  }
  console.info(`Processing zone: ${zone.properties.tzid} with ${zone.geometry.coordinates[0].length} points`)

  var opts = {min_zoom: z, max_zoom: z};

  cover.tiles(zone.geometry, opts).forEach(function(tile) {
    var id = tile.join('/');
    var poly = turf.polygon(tilebelt.tileToGeoJSON(tile).coordinates);

    try {
      var overlap = turf.area(turf.intersect(zone, poly));
      if (!tiles[id] || tiles[id].overlap < overlap)
        tiles[id] = {name: zone.properties.tzid, overlap: overlap};
    } catch (e) {
      console.log('Error detected: ' + e.message + '; zone: ' + zone.properties.tzid + '; tile: ' + id);
    }

  });

  zonesDone++;
  console.info(`${zonesDone}/${totalZones}. Processed zone: ${zone.properties.tzid}`)

  done();
}
