# timespace [![Build Status](https://travis-ci.org/mapbox/timespace.svg?branch=master)](https://travis-ci.org/mapbox/timespace)
Compute fuzzy local time from a location.


## Install
```
npm install @mapbox/timespace
```

## Use
```js
var ts = require('@mapbox/timespace');

var timestamp = Date.now();
var point = [-122.27783203125, 37.84015683604136];
var time = ts.getFuzzyLocalTimeFromPoint(timestamp, point);
//=> (a moment object)


var tile = [41, 98, 8];
var timezone1 = ts.getFuzzyTimezoneFromTile(tile);
//=> 'America/Los_Angeles'

var quadkey = '02301021';
var timezone2 = ts.getFuzzyTimezoneFromQuadkey(quadkey);
//=> 'America/Los_Angeles'
```
Any tiles passed with zoom levels > 8 will return the timezone of its z8 parent.
Any tiles passed with zoom levels < 8 will return the most popular timezone amongst its z8 children.


## Regenerate timezones.json
```
npm run regenerate
```
