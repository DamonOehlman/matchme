var matchme = require('matchme'),
    expect = require('chai').expect,
    testdata = require('./helpers/testdata');
    
describe('== tests', function() {
    it('can test an object for equality', function() {
        var result = matchme(testdata.fred, 'name == fred');
        
        expect(result).to.be.ok;
    });
    
    it('can test an object for equality through the function interfaces', function() {
        var matcher = matchme(testdata.fred);
        
        expect(matcher.equals('name', 'fred').passes).to.be.ok;
    });
    
    it('fails on a case-sensitive match with incorrect case', function() {
        var matcher = matchme(testdata.fred, { caseSensitive: true });
        
        expect(matcher.equals('name', 'fred').passes).to.not.be.ok;
    });
    
    it('passes a case-sensitive match with matching case', function() {
        var matcher = matchme(testdata.fred, { caseSensitive: true });
        
        expect(matcher.equals('name', 'Fred').passes).to.be.ok;
    });
});
