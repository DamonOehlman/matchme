var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('regex (=~) tests', function(t) {
    t.plan(4);
    t.ok(matchme(testdata.fred, 'name =? /^f/i'), 'fred starts with an f');
    t.notOk(matchme(testdata.fred, 'name =? /^b/i'), 'fred starts with a b - not');
    t.ok(matchme(testdata.fred, 'name =? /\\w{3,}/'), 'fred has at least three word characters - ok');
    t.ok(matchme(testdata.bob, 'name =? /\\w{3,}/'), 'bob has at least three word characters - ok');
});

test('negative regex (!~) tests', function(t) {
    t.plan(2);
    t.notOk(matchme(testdata.fred, 'name !? /^f/i'), 'fred does not start with an f - not ok');
    t.ok(matchme(testdata.fred, 'name !? /^b/i'), 'fred does not start with a b - ok');
});
