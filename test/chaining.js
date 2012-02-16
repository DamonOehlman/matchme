var matchme = require('matchme'),
    expect = require('chai').expect,
    testdata = require('./helpers/testdata');
    
describe('chaining', function() {
    it('can chain matcher methods together', function() {
        var matcher = matchme(testdata.fred);
        
        matcher
            .equals('name', 'fred')
            .gt('age', 15);

        expect(matcher.passes).to.be.ok;
    });
    
    it('chaining methods works in a logical AND kind of way', function() {
        var matcher = matchme(testdata.fred);
        
        matcher
            .equals('name', 'fred')
            .gt('age', 25);

        expect(matcher.passes).to.not.be.ok;
    });
});
