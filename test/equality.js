var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('== tests', function(t) {
    var matcher;

    t.plan(7);

    t.ok(matchme(testdata.fred, 'name == Fred'), 'can test an object for equality');
    t.ok(matchme(testdata.fred, 'name == "Fred"'), 'can test an object for equality');
    t.ok(matchme(testdata.fred, 'name == \'Fred\''), 'can test an object for equality');
    t.ok(matchme(testdata.fred, 'name ~= fred'), 'can test an object for equality');


    matcher = matchme(testdata.fred);
    t.ok(
        matcher.equals('name', 'Fred').ok,
        'can test an object for equality through the function interfaces'
    );

    matcher = matchme(testdata.fred);
    t.notOk(
        matcher.equals('name', 'fred').ok,
        'fails on a case-sensitive match with incorrect case'
    );

    t.ok(
        matchme(testdata.fred, 'pet == "Flying Badger"'),
        'can test using quoted strings'
    );
});
