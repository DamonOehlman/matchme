var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('nested property access', function(t) {
    t.plan(2);
    t.ok(matchme(testdata.location1, 'area.name == Brisbane'));
    t.notOk(matchme(testdata.location1, 'area.size > 500'), 'deals with properties that dont exist gracefully');
});

test('nested property access (quoted)', function(t) {
    t.plan(1);
    t.ok(matchme(testdata.location1, 'area.name == "Brisbane"'));
});

test('nested property access (single quoted)', function(t) {
    t.plan(1);
    t.ok(matchme(testdata.location1, 'area.name == \'Brisbane\''));
});
