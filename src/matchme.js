//= core/matcher

/*
Create a matcher that will execute against the specified target.
*/
function matchme(target, opts, query) {
    var matcher;
    
    // check for no options being supplied (which is the default)
    if (typeof opts == 'string' || opts instanceof String) {
        query = opts;
        opts = {};
    }
    
    // create the matcher
    matcher = new Matcher(target, opts);
    
    if (typeof query != 'undefined') {
        return matcher.query(query).ok;
    }
    else {
        return matcher;
    }
}

matchme.filter = function(array, query, opts) {
    var matcher;
    
    // if the array has been ommitted (perhaps underscore is being used)
    // then push up arguments and undef the array
    if (typeof array == 'string' || array instanceof String) {
        opts = query;
        query = array;
        array = null;
    }
    
    // create the matcher on a null target
    matcher = new Matcher(null, opts);
    
    if (array) {
        var results = [];
        for (var ii = 0, count = array.length; ii < count; ii++) {
            matcher.target = array[ii];
            if (matcher.query(query).ok) {
                results[results.length] = array[ii];
            }
        }
        
        return results;
    }
    else {
        return function(target) {
            // update the matcher target
            matcher.target = target;
            
            return matcher.query(query).ok;
        };
    }
};