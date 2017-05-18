var timezones = require('../lib/timezones.json');
var test = require('tap').test;
var moment = require('moment-timezone');
var ts = require('../');

var z = Object.keys(timezones)[0].split('/').map(Number)[2];

test('check zone', function(t) {
  var timestamp = 1472168219655;
  var point = [-122.27783203125, 37.84015683604136];
  var tile = [41, 98, 8];
  var quadkey = '02301021';
  var quadkey2 = '02301023';

  if (z === 8) {
    var expected = moment.tz(new Date(timestamp), 'America/Los_Angeles');
    t.deepequal(ts.getFuzzyLocalTimeFromPoint(timestamp, point), expected);
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey2), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyLocalTimeFromPoint(timestamp, point)._z.name.indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey2).indexOf('/') > 0);
  }

  t.end();
});

test('check lower zoom levels', function(t) {
  // z7
  var quadkeyZ7 = '0230102';
  var quadkeyZ6 = '023010';
  var quadkeyZ5 = '02301';

  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkeyZ7), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkeyZ6), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkeyZ5), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkeyZ7).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkeyZ6).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkeyZ5).indexOf('/') > 0);
  }

  t.end();
});


test('check higher zoom levels', function(t) {
  var tile, quadkey;

  // z9
  tile = [83, 196, 9];
  quadkey = '023010211';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z10
  tile = [167, 392, 10];
  quadkey = '0230102111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z11
  tile = [355, 784, 11];
  quadkey = '02301021111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z12
  tile = [671, 1568, 12];
  quadkey = '023010211111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z13
  tile = [1343, 3136, 13];
  quadkey = '0230102111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z14
  tile = [2687, 6272, 14];
  quadkey = '02301021111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z15
  tile = [5375, 12544, 15];
  quadkey = '023010211111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z16
  tile = [10751, 25088, 16];
  quadkey = '0230102111111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z17
  tile = [21503, 50176, 17];
  quadkey = '0230102111111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z18
  tile = [43007, 100352, 18];
  quadkey = '02301021111111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z19
  tile = [86015, 200704,  19];
  quadkey = '023010211111111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z20
  tile = [172031, 401408, 20];
  quadkey = '0230102111111111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  // z21
  tile = [344063, 802816, 21];
  quadkey = '02301021111111111111';
  if (z === 8) {
    t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');
    t.equal(ts.getFuzzyTimezoneFromQuadkey(quadkey), 'America/Los_Angeles');
  } else {
    t.true(ts.getFuzzyTimezoneFromTile(tile).indexOf('/') > 0);
    t.true(ts.getFuzzyTimezoneFromQuadkey(quadkey).indexOf('/') > 0);
  }

  t.end();
});

test('get parent', function(t) {
  var tile = [344063, 802816, 21];
  var actual = ts.getParent(tile);

  if (z === 8) {
    t.deepEqual(actual, [41, 98, 8], 'finds tile\'s z8 parent');
  } else {
    t.equal(actual[2], z);
  }

  t.end();
});



test('get children', function(t) {
  if (z === 8) {
    var tile = [20, 49, 7];
    var expected = [[40, 98, 8], [41, 98, 8], [41, 99, 8], [40, 99, 8]];
    var actual = ts.getChildren(tile);
    t.deepequal(actual, expected, 'finds tile\'s z8 children');

    tile = [10, 24, 6];
    actual = ts.getChildren(tile);
    t.equal(actual.length, 16, 'finds 16 children')
    actual.forEach(function(child) {
      t.equal(child[2], 8, 'finds z8 child')
    });
  }

  t.end();
});
