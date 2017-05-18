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


var tile = [41, 98, 8];     // the tile [x, y, z] whose timezone we want to know
var timezone1 = ts.getFuzzyTimezoneFromTile(tile);
//=> 'America/Los_Angeles'


var quadkey = '02301021';   // the quadkey whose timezone we want to know
var timezone2 = ts.getFuzzyTimezoneFromQuadkey(quadkey);
//=> 'America/Los_Angeles'
```

`./lib/timezones.json` file contains the timezone for every z8 land tile.

If a tile/quadkey with zoom levels > 8 is passed into timespace functions, the timezone of its z8 parent is returned.
If a tile/quadkey with zoom levels < 8 is passed into timespace functions, return the most popular timezone amongst its z8 children is returned.


## Regenerate timezones.json

```
npm run regenerate
```
