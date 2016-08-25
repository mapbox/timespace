var test = require('tap').test;
var ts = require('../');

test('check zone', function(t) {
  var timestamp = 1472168219655;
  var point = [-122.27783203125, 37.84015683604136];
  t.equal(ts.getFuzzyLocalTimeFromPoint(timestamp, point), '2016-08-25T16:36:59-07:00');

  var tile = [20,49,7];
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');

  var quadkey = '0230102';
  t.equal(ts.getFuzzyTimezoneFromTile(tile), 'America/Los_Angeles');

  t.end();
});
