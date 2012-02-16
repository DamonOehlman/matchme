var matchme = require('matchme'),
    expect = require('chai').expect,
    testdata = require('./helpers/testdata');
    
describe('> tests', function() {
    it('fred is older than 20', function() {
        var result = matchme(testdata.fred, 'age > 20');
        
        expect(result).to.not.be.ok;
    });
    
    it('bob is older than 20', function() {
        var result = matchme(testdata.bob, 'age > 20');
        
        expect(result).to.be.ok;
    });
});
