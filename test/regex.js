describe('regex (=~) tests', function() {
    var matchme = require('../matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('fred starts with an f - ok', function() {
        var result = matchme(testdata.fred, 'name =~ /^f/i');
        
        expect(result).to.be.ok();
    });

    it('fred starts with a b - not ok', function() {
        var result = matchme(testdata.fred, 'name =~ /^b/i');
        
        expect(result).to.not.be.ok();
    });
    
    it('fred has at least three word characters - ok', function() {
        var result = matchme(testdata.fred, 'name =~ /\\w{3,}/');
        
        expect(result).to.be.ok();
    });

    it('bob has at least three word characters - ok', function() {
        var result = matchme(testdata.bob, 'name =~ /\\w{3,}/');
        
        expect(result).to.be.ok();
    });
});

describe('negative regex (!~) tests', function() {
    var matchme = require('../matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');
    
    it('fred does not start with an f - not ok', function() {
        var result = matchme(testdata.fred, 'name !~ /^f/i');
        
        expect(result).to.not.be.ok();
    });

    it('fred does not start with a b - ok', function() {
        var result = matchme(testdata.fred, 'name !~ /^b/i');
        
        expect(result).to.be.ok();
    });
});
