var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('< tests', function(t) {
    t.plan(4);
    t.notOk(matchme(testdata.fred, 'age < 20'));
    t.ok(matchme(testdata.fred, 'age < 25'));
    t.ok(matchme(testdata.location1, 'latitude < -27'));
    t.ok(matchme(testdata.location2, 'latitude < -28'));
});