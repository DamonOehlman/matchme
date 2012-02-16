// A dummy header
(function (glob) {
    var version = "!{pkg:version}";
    
    var reExpr = /([\w\.]+)\s*([\>\<\!\=]\=?)\s*([\w\.]+)/,
        exprLookups = {
            '==': ['equals'],
            '>':  ['gt'],
            '>=': ['gte'],
            '<':  ['lt'],
            '<=': ['lte'],
            '!=': ['equals', 'not']
        };
    
    function Matcher(target, opts) {
        // initialise options
        this.opts = opts || {};
    
        // initialise members
        this.target = target;
        this.passes = true;
    }
    
    Matcher.prototype = {
        gt: function(prop, value, result) {
            result = result || this;
            result.passes = result.passes && this.target && this.target[prop] > value;
            
            return this;
        },
        
        gte: function(prop, value, result) {
            result = result || this;
            result.passes = result.passes && this.target && this.target[prop] >= value;
            
            return this;
        },
        
        lt: function(prop, value, result) {
            result = result || this;
            result.passes = result.passes && this.target && this.target[prop] < value;
            
            return this;
        },
        
        lte: function(prop, value, result) {
            result = result || this;
            result.passes = result.passes && this.target && this.target[prop] <= value;
            
            return this;
        },
        
        equals: function(prop, value, result) {
            result = result || this;
            
            if (result.passes && this.target) {
                var testVal = this.target[prop],
                    strings = (typeof testVal == 'string' || testVal instanceof String) &&
                        (typeof value == 'string' || value instanceof String);
    
                // if the test value is a string and the value is a string
                if (strings && (! this.opts.caseSensitive)) {
                    result.passes = testVal.toLowerCase() === value.toLowerCase();
                }
                else {
                    result.passes = testVal === value;
                }
            }
            
            return this;
        },
        
        not: function(prop, value, result) {
            // invert the passes state
            result = result || this;
            result.passes = !result.passes;
            
            return this;
        },
        
        query: function(text) {
            var match = reExpr.exec(text);
                
            while (match) {
                var fns = exprLookups[match[2]] || [],
                    result = {
                        passes: fns.length > 0
                    },
                    val1 = parseFloat(match[1]) || match[1],
                    val2 = parseFloat(match[3]) || match[3];
                
                // iterate through the required functions in order and evaluate the result
                for (var ii = 0, count = fns.length; ii < count; ii++) {
                    var evaluator = this[fns[ii]];
                    
                    // if we have the evaluator, then run it
                    if (evaluator) {
                        evaluator.call(this, val1, val2, result);
                    }
                }
                
                text = text.slice(0, match.index) + result.passes + text.slice(match.index + match[0].length);
                match = reExpr.exec(text);
            }
            
            // split the text on
            this.passes = eval(text);
            
            return this;
        }
    };

    
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
            return matcher.query(query).passes;
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
        };
        
        // create the matcher on a null target
        matcher = new Matcher(null, opts);
        
        if (array) {
            var results = [];
            for (var ii = 0, count = array.length; ii < count; ii++) {
                matcher.target = array[ii];
                if (matcher.query(query).passes) {
                    results[results.length] = array[ii];
                }
            }
            
            return results;
        }
        else {
            return function(target) {
                // update the matcher target
                matcher.target = target;
                
                return matcher.query(query).passes;
            };
        }
    };

    (typeof module != "undefined" && module.exports) ? (module.exports = matchme) : (typeof define != "undefined" ? (define("matchme", [], function() { return matchme; })) : (glob.matchme = matchme));
})(this);