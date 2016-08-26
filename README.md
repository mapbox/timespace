# timespace [![Build Status](https://travis-ci.org/mapbox/timespace.svg?branch=master)](https://travis-ci.org/mapbox/timespace)
Compute fuzzy local time from a location.


## Install
```
npm install timespace
```

## Use
```js
var ts = require('timespace');

var timestamp = Date.now();
var point = [-122.27783203125, 37.84015683604136];
var time = ts.getFuzzyLocalTimeFromPoint(timestamp, point);
//=> '2016-08-25T16:43:12-07:00'


// Currently only support zoom level 7
var tile = [20,49,7];
var timezone1 = ts.getFuzzyTimezoneFromTile(tile);
//=> 'America/Los_Angeles'

var quadkey = '0230102';
var timezone2 = ts.getFuzzyTimezoneFromTile(tile);
//=> 'America/Los_Angeles'
```


## Regenerate timezones.json
```
npm run regenerate
```