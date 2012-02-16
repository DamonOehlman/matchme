var testdata = {
    fred: {
        name: 'Fred',
        pet: 'Flying Badger',
        age: 20, 
        bald: false
    },
    
    bob: {
        name: 'Bob',
        pet: 'Jumping Squirrel',
        age: 40,
        bald: true
    }
};

if (typeof module != 'undefined' && module.exports) {
    module.exports = testdata;
};