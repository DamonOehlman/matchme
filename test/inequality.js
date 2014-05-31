var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('!= tests', function(t) {
  t.plan(4);
  t.ok(matchme(testdata.fred, 'name != Bob'));
  t.notOk(matchme(testdata.fred, 'name != Fred'));

  t.ok(matchme(testdata.fred, 'name != fred'));
  t.notOk(matchme(testdata.fred, 'name !~ fred'));
});
