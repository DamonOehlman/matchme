var matchme = require('matchme'),
    expect = require('expect.js'),
    testdata = require('./helpers/testdata');
    
describe('>= tests', function() {
    it('fred is 20 or older', function() {
        var result = matchme(testdata.fred, 'age >= 20');
        
        expect(result).to.be.ok();
    });
    
    it('fred is 40 or older', function() {
        var result = matchme(testdata.fred, 'age >= 40');
        
        expect(result).to.not.be.ok();
    });
    
    it('bob is 20 or older', function() {
        var result = matchme(testdata.bob, 'age >= 20');
        
        expect(result).to.be.ok();
    });
    
    it('bob is 40 or older', function() {
        var result = matchme(testdata.bob, 'age >= 40');
        
        expect(result).to.be.ok();
    });
});
