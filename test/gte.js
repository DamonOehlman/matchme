var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('>= tests', function(t) {
    t.plan(6);
    t.ok(matchme(testdata.fred, 'age >= 20'));
    t.notOk(matchme(testdata.fred, 'age >= 40'));
    t.ok(matchme(testdata.bob, 'age >= 20'));
    t.ok(matchme(testdata.bob, 'age >= 40'));
    t.ok(matchme(testdata.location1, 'latitude >= -28'));
    t.ok(matchme(testdata.location2, 'latitude >= -29')); 
});