//@header
(function (glob) {
    var version = "!{pkg:version}";
    
    //= core/matcher
    
    function matchme(target, query) {
        var matcher = new Matcher(target);
        
        if (typeof query != 'undefined') {
            return matcher.query(query);
        }
        else {
            return matcher;
        }
    }

    //@export matchme
})(this);