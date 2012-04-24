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
    },
    
    location1: {
        latitude: -27.61091533,
        longitude: 153.1017066,
        area: {
            name: 'Brisbane'
        }
    },
    
    location2: {
        latitude: -28.45453131,
        longitude: 153.1321275,
        area: {
            name: 'Border Ranges'
        }
    }
};

if (typeof module != 'undefined' && module.exports) {
    module.exports = testdata;
}