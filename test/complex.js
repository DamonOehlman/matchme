var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('complex expressions', function(t) {

    t.plan(4);

    t.ok(
        matchme(testdata.fred, '(name == "Fred") || (name == "Bob")'),
        'name is bob or fred (check fred)'
    );


    t.ok(
        matchme(testdata.bob, 'name == "Fred" || name == "Bob"'),
        'name is bob or fred (check bob)'
    );

    t.notOk(
        matchme(testdata.fred, 'name == "Wilbur" || age > 38'),
        'name is wilbur or age is greater than 38 (check fred)'
    );

    t.ok(
        matchme(testdata.bob, 'name == "Wilbur" || age > 38'),
        'name is wilbur or age is greater than 38 (check bob)'
    );
});
