describe('nested property access', function() {
    var matchme = require('../matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('can check for matching property name', function() {
        var result = matchme(testdata.location1, 'area.name == Brisbane');
        expect(result).to.be.ok();
    });
    
    it('deals with properties that dont exist gracefully', function() {
        var result = matchme(testdata.location1, 'area.size > 500');
        expect(result).to.not.be.ok();
    });
});
