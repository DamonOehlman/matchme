var matchme = require('../'),
    test = require('tape'),
    testdata = require('./helpers/testdata');

test('js safety', function(t) {
    t.plan(2);
    t.notOk(matchme(testdata.fred, 'age >= 20 && alert(\'hi\');'));
    t.notOk(matchme(testdata.fred, 'age >= 20 && (function() { alert(\'hi\'); })()'));
});