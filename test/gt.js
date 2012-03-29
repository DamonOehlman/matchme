describe('> tests', function() {
    var matchme = require('../pkg/cjs/matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('fred is older than 20', function() {
        var result = matchme(testdata.fred, 'age > 20');
        
        expect(result).to.not.be.ok();
    });
    
    it('bob is older than 20', function() {
        var result = matchme(testdata.bob, 'age > 20');
        
        expect(result).to.be.ok();
    });
});
