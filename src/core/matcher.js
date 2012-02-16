var reExpr = /([\w\.]+)\s*([\>\<\!\=]\=?)\s*([\w\.]+)/,
    reBool = /^(true|false)$/i,
    reFalsyWords = /(undefined|null|false)/g,
    reTruthyWords = /(true)/g,
    reWords = /(\w{2,})/,
    reSillyFn = /0\(.*?\)/g,
    exprLookups = {
        '==': ['equals'],
        '>':  ['gt'],
        '>=': ['gte'],
        '<':  ['lt'],
        '<=': ['lte'],
        '!=': ['equals', 'not']
    },
    wordReplacements = {
        and: '&&',
        or: '||'
    };

function Matcher(target, opts) {
    // initialise options
    this.opts = opts || {};

    // initialise members
    this.target = target;
    this.ok = true;
}

Matcher.prototype = {
    gt: function(prop, value, result) {
        result = result || this;
        result.ok = result.ok && this.target && this.target[prop] > value;
        
        return this;
    },
    
    gte: function(prop, value, result) {
        result = result || this;
        result.ok = result.ok && this.target && this.target[prop] >= value;
        
        return this;
    },
    
    lt: function(prop, value, result) {
        result = result || this;
        result.ok = result.ok && this.target && this.target[prop] < value;
        
        return this;
    },
    
    lte: function(prop, value, result) {
        result = result || this;
        result.ok = result.ok && this.target && this.target[prop] <= value;
        
        return this;
    },
    
    equals: function(prop, value, result) {
        result = result || this;
        
        if (result.ok && this.target) {
            var testVal = this.target[prop],
                strings = (typeof testVal == 'string' || testVal instanceof String) &&
                    (typeof value == 'string' || value instanceof String);

            // if the test value is a string and the value is a string
            if (strings && (! this.opts.caseSensitive)) {
                result.ok = testVal.toLowerCase() === value.toLowerCase();
            }
            else {
                result.ok = testVal === value;
            }
        }
        
        return this;
    },
    
    not: function(prop, value, result) {
        // invert the passes state
        result = result || this;
        result.ok = !result.ok;
        
        return this;
    },
    
    query: function(text) {
        var match = reExpr.exec(text);
            
        while (match) {
            var fns = exprLookups[match[2]] || [],
                result = {
                    ok: fns.length > 0
                },
                val1 = parseFloat(match[1]) || match[1],
                val2 = parseFloat(match[3]) || match[3];
                
            // if value 2 is a boolean, then parse it
            if (reBool.test(val2)) {
                val2 = val2 == 'true';
            }
            
            // iterate through the required functions in order and evaluate the result
            for (var ii = 0, count = fns.length; ii < count; ii++) {
                var evaluator = this[fns[ii]];
                
                // if we have the evaluator, then run it
                if (evaluator) {
                    evaluator.call(this, val1, val2, result);
                }
            }
            
            text = text.slice(0, match.index) + result.ok + text.slice(match.index + match[0].length);
            match = reExpr.exec(text);
        }
        
        // replace falsy words with 0s and truthy words with 1s
        text = text.replace(reFalsyWords, '0').replace(reTruthyWords, '1');
        
        // find any remaining standalone words
        match = reWords.exec(text);
        while (match) {
            var replacement = wordReplacements[match[0].toLowerCase()];
            
            // if we don't have a replacement for a word then look for the value of the property on the target
            if ((! replacement) && this.target) {
                replacement = this.target[match[0]];
            }
            
            text = text.slice(0, match.index) + replacement + text.slice(match.index + match[0].length);
            
            // replace falsy words with 0s and truthy words with 1s
            text = text.replace(reFalsyWords, '0').replace(reTruthyWords, '1');
            
            // run the test again
            match = reWords.exec(text);
        }
        
        // replace peoples attempts at including functions with 0
        text = text.replace(reSillyFn, '0');
        
        // evaluate the expression
        try {
            this.ok = eval(text);
        }
        catch (e) {
            this.ok = false;
            this._errtext = text;
        }
        
        return this;
    }
};