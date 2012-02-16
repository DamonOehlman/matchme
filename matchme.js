// A dummy header
(function (glob) {
    var version = "!{pkg:version}";
    
    function Matcher(target) {
        
    }
    
    Matcher.prototype = {
        gte: function(prop, value) {
            
        },
        
        equals: function(prop, value) {
            
        },
        
        query: function(text) {
            return null;
        }
    };

    
    function matchme(target, query) {
        var matcher = new Matcher(target);
        
        if (typeof query != 'undefined') {
            return matcher.query(query);
        }
        else {
            return matcher;
        }
    }

    (typeof module != "undefined" && module.exports) ? (module.exports = matchme) : (typeof define != "undefined" ? (define("matchme", [], function() { return matchme; })) : (glob.matchme = matchme));
})(this);