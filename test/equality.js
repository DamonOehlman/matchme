describe('== tests', function() {
    var matchme = require('../matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('can test an object for equality', function() {
        var result = matchme(testdata.fred, 'name == fred');
        
        expect(result).to.be.ok();
    });
    
    it('can test an object for equality through the function interfaces', function() {
        var matcher = matchme(testdata.fred);
        
        expect(matcher.equals('name', 'fred').ok).to.be.ok();
    });
    
    it('fails on a case-sensitive match with incorrect case', function() {
        var matcher = matchme(testdata.fred, { caseSensitive: true });
        
        expect(matcher.equals('name', 'fred').ok).to.not.be.ok();
    });
    
    it('passes a case-sensitive match with matching case', function() {
        var matcher = matchme(testdata.fred, { caseSensitive: true });
        
        expect(matcher.equals('name', 'Fred').ok).to.be.ok();
    });
    
    it('can test using quoted strings', function() {
        var result = matchme(testdata.fred, 'pet == "flying badger"');
       
        expect(result).to.be.ok();
    });
});
