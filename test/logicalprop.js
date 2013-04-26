var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('standalone logical tests', function(t) {
    t.plan(6);
    t.notOk(matchme(testdata.fred, 'bald'));
    t.ok(matchme(testdata.fred, '!bald'));
    t.ok(matchme(testdata.bob, 'bald'));
    t.ok(matchme(testdata.fred, 'age > 15 && (!bald)'));
    t.notOk(matchme(testdata.fred, 'bald && age > 15'));
    t.ok(matchme(testdata, 'fred.pet'));
});