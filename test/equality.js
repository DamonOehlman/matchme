var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('== tests', function(t) {
    var matcher;

    t.plan(5);

    t.ok(matchme(testdata.fred, 'name == fred'), 'can test an object for equality');


    matcher = matchme(testdata.fred);
    t.ok(
        matcher.equals('name', 'fred').ok,
        'can test an object for equality through the function interfaces'
    );

    matcher = matchme(testdata.fred, { caseSensitive: true });
    t.notOk(
        matcher.equals('name', 'fred').ok,
        'fails on a case-sensitive match with incorrect case'
    );
    
    matcher = matchme(testdata.fred, { caseSensitive: true });
    t.ok(
        matcher.equals('name', 'Fred').ok,
        'passes a case-sensitive match with matching case'
    );
    
    t.ok(
        matchme(testdata.fred, 'pet == "flying badger"'),
        'can test using quoted strings'
    );
});
