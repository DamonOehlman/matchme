describe('chaining', function() {
    var matchme = require('../matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('can chain matcher methods together', function() {
        var matcher = matchme(testdata.fred);
        
        matcher
            .equals('name', 'fred')
            .gt('age', 15);

        expect(matcher.ok).to.be.ok();
    });
    
    it('chaining methods works in a logical AND kind of way', function() {
        var matcher = matchme(testdata.fred);
        
        matcher
            .equals('name', 'fred')
            .gt('age', 25);

        expect(matcher.ok).to.not.be.ok();
    });
});
