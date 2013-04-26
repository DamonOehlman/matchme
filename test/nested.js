var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('nested property access', function(t) {
    t.plan(2);
    t.ok(matchme(testdata.location1, 'area.name == Brisbane'));
    t.notOk(matchme(testdata.location1, 'area.size > 500'), 'deals with properties that dont exist gracefully');
});
