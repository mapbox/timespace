curl http://efele.net/maps/tz//world/tz_world_mp.zip -o tz_world_mp.zip;
unzip tz_world_mp.zip;
rm tz_world_mp.zip;
ogr2ogr -f GeoJSON timezones.geojson world/tz_world_mp.shp;
rm -rf world;
gzip -f timezones.geojson;
node ./regenerate/check-timezones.js timezones.geojson.gz timezones.geojson.gz;
node ./regenerate/quantize.js 8
rm timezones.geojson.gz;