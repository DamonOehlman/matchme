var matchme = require('matchme'),
    expect = require('expect.js'),
    testdata = require('./helpers/testdata');
    
describe('< tests', function() {
    it('fred < 20 is not ok', function() {
        var result = matchme(testdata.fred, 'age < 20');
        
        expect(result).to.not.be.ok();
    });
    
    it('fred < 25 is ok', function() {
        var result = matchme(testdata.fred, 'age < 25');
        
        expect(result).to.be.ok();
    });
});
