var matchme = require('matchme'),
    expect = require('chai').expect,
    testdata = require('./helpers/testdata');
    
describe('<= tests', function() {
    it('fred <= 20 is ok', function() {
        var result = matchme(testdata.fred, 'age <= 20');
        
        expect(result).to.be.ok;
    });
    
    it('fred <= 19 is not ok', function() {
        var result = matchme(testdata.fred, 'age <= 19');
        
        expect(result).to.not.be.ok;
    });
    
    it('bob <= 20 is not ok', function() {
        var result = matchme(testdata.bob, 'age <= 20');
        
        expect(result).to.not.be.ok;
    });
    
    it('bob <= 40 is ok', function() {
        var result = matchme(testdata.bob, 'age <= 40');
        
        expect(result).to.be.ok;
    });
});
