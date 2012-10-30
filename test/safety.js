describe('<= tests', function() {
    var matchme = require('../matchme'),
        expect = require('expect.js'),
        testdata = require('./helpers/testdata');

    it('alerts', function() {
        var result = matchme(testdata.fred, 'age >= 20 && alert(\'hi\');');
        
        expect(result).to.not.be.ok();
    });
    
    it('function definition', function() {
        var result = matchme(testdata.fred, 'age >= 20 && (function() { alert(\'hi\'); })()');
        expect(result).to.not.be.ok();
    });
});
