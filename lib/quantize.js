var fs = require('fs');
var path = require('path');
var cover = require('tile-cover');
var tilebelt = require('tilebelt');
var turf = require('turf');
var d3 = require('d3-queue');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var moment = require('moment-timezone');
var spawn = require('child_process').spawn

// for tracking progress
var zonesDone = 0;
var totalZones = 0;

var tiles = {};
var tzNames = {};

var dataPath = path.join(__dirname, 'data');
rimraf(dataPath, function () {
  mkdirp(dataPath);
});

// download timezone region border
console.info('Downloading timezone polygons...');
args = [
  'https://gist.githubusercontent.com/morganherlocker/1313f4163af757677da9/raw/2065e02ef2a8ec0346ead77e487dff557e1a5b6b/timezones.geojson',
  '-o', path.join(dataPath, 'timezones.geojson')
]
var proc = spawn('curl', args);

proc.on('close', function(code) {

  // load timezone polygons
  var zones = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/timezones.geojson'), 'utf8'));

  zones = zones.features.filter(function(zone) {
    return moment.tz.zone(zone.properties.TZID) !== null;
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
    if (err) throw err;

    Object.keys(tiles).forEach(function(tile) {
      tiles[tile] = tiles[tile].name;
    });

    fs.writeFileSync(path.join(__dirname, '/timezones.json'), JSON.stringify(tiles));
  });

  rimraf(dataPath, function() {});
});


function coverTile(zone, done) {
  // var z = 7;
  var z = 8;
  var opts = {min_zoom: z, max_zoom: z};

  cover.tiles(zone.geometry, opts).forEach(function(tile) {
    var id = tile.join('/');
    var poly = turf.polygon(tilebelt.tileToGeoJSON(tile).coordinates);
    var overlap = turf.area(turf.intersect(zone, poly));

    if (!tiles[id] || tiles[id].overlap < overlap)
      tiles[id] = {name: zone.properties.TZID, overlap: overlap};
  });

  zonesDone++;
  console.info('Processed', zonesDone + '/' + totalZones)

  done();
}