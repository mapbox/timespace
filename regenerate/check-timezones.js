/**
 * Removes timezones that are not supported by moment-timezone.
 *
 * USE:
 *   node check-timezones.js timezones.geojson.gz timezones-cleaned.geojson.gz
 */

var fs = require('fs');
var zlib = require('zlib');
var moment = require('moment-timezone');

var datafile = process.argv[2];
var outfile = process.argv[3];

if (!datafile) throw new Error('Timezone geojson file is required.');
if (!outfile) throw new Error('Output filename is required.');

var knownIssues = {
  'America/Monterey': 'America/Monterrey'
};

var buffer = fs.readFileSync(datafile);

zlib.gunzip(buffer, function(err, data) {
  if (err) throw err;

  var zones = JSON.parse(data);

  // filter out timezones not supported by moment-timezone
  zones.features = zones.features.filter(function(zone) {

    // check if TZID is in `moment-timezone` library
    if (moment.tz.zone(zone.properties.TZID) === null) {

      if (zone.properties.TZID in knownIssues) {
        // if known issue, replace with the correct TZID
        var wrongTz = zone.properties.TZID;
        var correctTz = knownIssues[zone.properties.TZID];
        zone.properties.TZID = correctTz;
        console.log('Fixed timezone: ' + wrongTz + ' -> ' + correctTz);
        return true;

      } else {
        // if issue not known, remove from geojson
        console.log('Filtered out bad timezone ' + zone.properties.TZID);
        return false;
      }
    } else return true;
  });

  zlib.gzip(JSON.stringify(zones), function(err, result) {
    if (err) throw err;

    fs.writeFileSync(outfile, result);
  });
});

