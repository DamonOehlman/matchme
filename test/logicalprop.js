var matchme = require('matchme'),
    expect = require('expect.js'),
    testdata = require('./helpers/testdata');
    
describe('standalone logical tests', function() {
    it('fred is bald - not ok', function() {
        var result = matchme(testdata.fred, 'bald');
        
        expect(result).to.not.be.ok();
    });
    
    it('fred is not bald - ok', function() {
        var result = matchme(testdata.fred, '!bald');
        
        expect(result).to.be.ok();
    });
    
    it('bob is bald - ok', function() {
        var result = matchme(testdata.bob, 'bald');
        
        expect(result).to.be.ok();
    });
    
    it('fred is older than 15 and !bald - ok', function() {
        var result = matchme(testdata.fred, 'age > 15 && (!bald)');
        
        expect(result).to.be.ok();
    });
    
    it('fred is older than 15 and bald - not ok', function() {
        var result = matchme(testdata.fred, 'bald && age > 15');
        
        expect(result).to.not.be.ok();
    });
});
