var testdata = {
    fred: { name: 'Fred', age: 20, bald: false },
    bob: { name: 'Bob', age: 40, bald: true }
};

if (typeof module != 'undefined' && module.exports) {
    module.exports = testdata;
};