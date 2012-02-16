var matchme = require('matchme'),
    expect = require('chai').expect,
    testdata = require('./helpers/testdata');
    
describe('standalone logical tests', function() {
    it('fred is bald - not ok', function() {
        var result = matchme(testdata.fred, 'bald');
        
        expect(result).to.not.be.ok;
    });
    
    it('fred is not bald - ok', function() {
        var result = matchme(testdata.fred, '!bald');
        
        expect(result).to.be.ok;
    });
    
    it('bob is bald - ok', function() {
        var result = matchme(testdata.bob, 'bald');
        
        expect(result).to.be.ok;
    });
});
