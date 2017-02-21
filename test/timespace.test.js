var test = require('tap').test;
var moment = require('moment-timezone');
var ts = require('../');


test('check zone', function(t) {
  var timestamp = 1472168219655;
  var point = [-122.27783203125, 37.84015683604136];
  var expected = moment.tz(new Date(timestamp), 'America/Los_Angeles');
  t.deepequal(ts.getFuzzyLocalTimeFromPoint(timestamp, point), expected);

  var tile = [41, 98, 8];
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');

  var quadkey = '02301021';
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  quadkey = '02301023';
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  t.end();
});

test('check lower zoom levels', function(t) {
  // z7
  var quadkey = '0230102';
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z6
  quadkey = '023010';
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z5
  quadkey = '02301';
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  t.end();
});

test('check higher zoom levels', function(t) {
  var tile, quadkey;

  // z9
  tile = [83, 196, 9];
  quadkey = '023010211';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z10
  tile = [167, 392, 10];
  quadkey = '0230102111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z11
  tile = [355, 784, 11];
  quadkey = '02301021111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z12
  tile = [671, 1568, 12];
  quadkey = '023010211111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z13
  tile = [1343, 3136, 13];
  quadkey = '0230102111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z14
  tile = [2687, 6272, 14];
  quadkey = '02301021111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z15
  tile = [5375, 12544, 15];
  quadkey = '023010211111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z16
  tile = [10751, 25088, 16];
  quadkey = '0230102111111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z17
  tile = [21503, 50176, 17];
  quadkey = '0230102111111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z18
  tile = [43007, 100352, 18];
  quadkey = '02301021111111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z19
  tile = [86015, 200704,  19];
  quadkey = '023010211111111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z20
  tile = [172031, 401408, 20];
  quadkey = '0230102111111111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  // z21
  tile = [344063, 802816, 21];
  quadkey = '02301021111111111111';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
  t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');

  t.end();
});

test('get z8 parent', function(t) {
  var expected = [41, 98, 8].join('/');
  var tile = [344063, 802816, 21];
  var actual = ts.getz8Parent(tile).join('/');
  t.equal(actual, expected, 'finds tile\'s z8 parent');

  t.end();
});



test('get z8 children', function(t) {
  var tile = [20, 49, 7];
  var expected = [[40, 98, 8], [41, 98, 8], [41, 99, 8], [40, 99, 8]];
  var actual = ts.getz8Children(tile);
  t.deepequal(actual, expected, 'finds tile\'s z8 children');

  tile = [10, 24, 6];
  actual = ts.getz8Children(tile);
  t.equal(actual.length, 16, 'finds 16 children')
  actual.forEach(function(child) {
    t.equal(child[2], 8, 'finds z8 child')
  });
  t.end();
});
