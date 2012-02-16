// A dummy header
(function (glob) {
    var version = "!{pkg:version}";
    
    function Matcher(target, opts) {
        // initialise options
        this.opts = opts || {};
    
        // initialise members
        this.target = target;
        this.passes = true;
    }
    
    Matcher.prototype = {
        gte: function(prop, value) {
            this.passes = this.passes && this.target && this.target[prop] >= value;
            return this;
        },
        
        equals: function(prop, value) {
            if (this.passes && this.target) {
                var testVal = this.target[prop],
                    strings = (typeof testVal == 'string' || testVal instanceof String) &&
                        (typeof value == 'string' || value instanceof String);
                        
                // if the test value is a string and the value is a string
                if (strings && (! this.opts.caseSensitive)) {
                    this.passes = testVal.toLowerCase() === value.toLowerCase();
                }
                else {
                    this.passes = testVal === value;
                }
            }
            
            return this;
        },
        
        query: function(text) {
            // TODO: parse the query and then execute the required comparison functions
            
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

    (typeof module != "undefined" && module.exports) ? (module.exports = matchme) : (typeof define != "undefined" ? (define("matchme", [], function() { return matchme; })) : (glob.matchme = matchme));
})(this);