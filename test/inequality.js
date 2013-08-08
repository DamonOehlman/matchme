var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('!= tests', function(t) {
    t.plan(2);
    t.ok(matchme(testdata.fred, 'name != "Bob"'));
    t.notOk(matchme(testdata.fred, 'name != "Fred"'));
});