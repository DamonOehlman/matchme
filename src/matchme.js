//@header
(function (glob) {
    var version = "!{pkg:version}";
    
    //= core/matcher
    
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

    //@export matchme
})(this);