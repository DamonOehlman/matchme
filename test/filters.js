var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata'),
    testArray = [testdata.fred, testdata.bob],
    _ = require('underscore');


test('can find objects that are called fred', function(t) {
    var results = matchme.filter(testArray, 'name == fred');
    
    t.plan(2);
    t.ok(results);
    t.equal(results.length, 1);
});

test('can find objects that are called fred (using underscore)', function(t) {
    var results = _.filter(testdata, matchme.filter('name == fred'));
    
    t.plan(2);
    t.ok(results);
    t.equal(results.length, 1);
});