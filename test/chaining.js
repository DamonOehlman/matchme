var test = require('tape'),
    matchme = require('../'),
    testdata = require('./helpers/testdata');

test('can chain matcher methods together', function(t) {
    var matcher = matchme(testdata.fred);

    matcher
        .equals('name', 'Fred')
        .gt('age', 15);

    t.plan(1);
    t.ok(matcher.ok);
});

test('chaining methods works in a logical AND kind of way', function(t) {
    var matcher = matchme(testdata.fred);

    matcher
        .equals('name', 'Fred')
        .gt('age', 25);

    t.plan(1);
    t.notOk(matcher.ok);
});
