var matchme = require('matchme'),
    expect = require('chai').expect,
    testdata = require('./helpers/testdata');
    
describe('simple equality tests', function() {
    it('can test an object for equality', function() {
        var result = matchme(testdata[0], 'name == fred');
        
        expect(result).to.be.ok;
    });
    
    it('can extract matching objects from an array', function() {
        var results = matchme(testdata, 'name == fred');
        
        expect(results).to.exist;
        expect(results.length).to.equal(1);
    });
    
    it('can test an object for equality through the function interfaces', function() {
        var matcher = matchme(testdata[0]);
        
        expect(matcher.equals('name', 'fred')).to.be.ok;
    });
    
    it('can extract matching objects using the function interfaces', function() {
        var matcher = matchme(testdata),
            results = matcher.equals('name', 'fred');
            
        expect(results).to.exist;
        expect(results.length).to.equal(1);
    });
});
