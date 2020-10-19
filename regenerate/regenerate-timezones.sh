curl -L https://github.com/evansiroky/timezone-boundary-builder/releases/download/2020a/timezones-with-oceans.geojson.zip -o timezones.geojson.zip;
unzip timezones.geojson.zip;
rm timezones.geojson.zip;
mv dist/combined-with-oceans.json timezones.geojson;
rm -rf dist;
gzip -f timezones.geojson;
node ./regenerate/check-timezones.js timezones.geojson.gz timezones.geojson.gz;
node ./regenerate/quantize.js 8
rm timezones.geojson.gz;
