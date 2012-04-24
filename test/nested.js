describe('nested property access', function() {
    var matchme = require('../pkg/cjs/matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('can check for matching property name', function() {
        var result = matchme(testdata.location1, 'area.name == Brisbane');
        expect(result).to.be.ok();
    });
});
