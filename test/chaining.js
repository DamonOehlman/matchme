var assert = require('assert'),
    matchme = require('../'),
    testdata = require('./helpers/testdata');

describe('chaining', function() {
    it('can chain matcher methods together', function() {
        var matcher = matchme(testdata.fred);
        
        matcher
            .equals('name', 'fred')
            .gt('age', 15);

        assert(matcher.ok);
    });
    
    it('chaining methods works in a logical AND kind of way', function() {
        var matcher = matchme(testdata.fred);
        
        matcher
            .equals('name', 'fred')
            .gt('age', 25);

        assert(! matcher.ok);
    });
});
