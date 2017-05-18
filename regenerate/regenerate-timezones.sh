curl -L https://github.com/evansiroky/timezone-boundary-builder/releases/download/2017a/timezones.shapefile.zip -o tz_world_mp.zip;
unzip tz_world_mp.zip;
rm tz_world_mp.zip;
ogr2ogr -f GeoJSON timezones.geojson dist/combined_shapefile.shp;
rm -rf dist;
gzip -f timezones.geojson;
node ./regenerate/check-timezones.js timezones.geojson.gz timezones.geojson.gz;
node ./regenerate/quantize.js 3
rm timezones.geojson.gz;