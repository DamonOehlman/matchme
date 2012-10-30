describe('<= tests', function() {
    var matchme = require('../matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('fred <= 20 is ok', function() {
        var result = matchme(testdata.fred, 'age <= 20');
        
        expect(result).to.be.ok();
    });
    
    it('fred <= 19 is not ok', function() {
        var result = matchme(testdata.fred, 'age <= 19');
        
        expect(result).to.not.be.ok();
    });
    
    it('bob <= 20 is not ok', function() {
        var result = matchme(testdata.bob, 'age <= 20');
        
        expect(result).to.not.be.ok();
    });
    
    it('bob <= 40 is ok', function() {
        var result = matchme(testdata.bob, 'age <= 40');
        
        expect(result).to.be.ok();
    });
    
    it('location 1 found', function() {
        var result = matchme(testdata.location1, 'latitude <= -27');
        expect(result).to.be.ok();
    });
    
    it('location 2 found', function() {
        var result = matchme(testdata.location2, 'latitude <= -28');
        
        expect(result).to.be.ok();
    });
});
