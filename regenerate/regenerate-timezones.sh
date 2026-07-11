#!/bin/bash

set -e
# please, update tz data link from https://github.com/evansiroky/timezone-boundary-builder/releases/
echo -e "downloading"
curl -L https://github.com/evansiroky/timezone-boundary-builder/releases/download/2020d/timezones.geojson.zip -o timezones.geojson.zip
echo -e "switching from zip to zlib based (gz)"
unzip timezones.geojson.zip
rm timezones.geojson.zip
mv combined.json input-timezones.geojson
gzip -f input-timezones.geojson
echo -e "check timezones..."
node ./regenerate/check-timezones.js input-timezones.geojson.gz timezones.geojson.gz
echo -e "quantize..."
node ./regenerate/quantize.js 8
echo -e "update done on lib/timezones.json ."
rm input-timezones.geojson.gz
