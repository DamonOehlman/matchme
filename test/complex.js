describe('complex expressions', function() {
    var matchme = require('../matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('name is bob or fred (check fred)', function() {
        var result = matchme(testdata.fred, '(name == fred) || (name == bob)');
        
        expect(result).to.be.ok();
    });

    it('name is bob or fred (check bob)', function() {
        var result = matchme(testdata.bob, 'name == fred || name == bob');
        
        expect(result).to.be.ok();
    });
    
    it('name is wilbur or age is greater than 38 (check fred)', function() {
        var result = matchme(testdata.fred, 'name == wilbur || age > 38');
        
        expect(result).to.not.be.ok();
    });
    
    it('name is wilbur or age is greater than 38 (check bob)', function() {
        var result = matchme(testdata.bob, 'name == wilbur || age > 38');
        
        expect(result).to.be.ok();
    });
});
