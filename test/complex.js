var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('complex expressions', function(t) {

    t.plan(4);

    t.ok(
        matchme(testdata.fred, '(name ~= fred) || (name ~= bob)'),
        'name is bob or fred (check fred)'
    );


    t.ok(
        matchme(testdata.bob, 'name ~= fred || name ~= bob'),
        'name is bob or fred (check bob)'
    );

    t.notOk(
        matchme(testdata.fred, 'name ~= wilbur || age > 38'),
        'name is wilbur or age is greater than 38 (check fred)'
    );

    t.ok(
        matchme(testdata.bob, 'name ~= wilbur || age > 38'),
        'name is wilbur or age is greater than 38 (check bob)'
    );
});
