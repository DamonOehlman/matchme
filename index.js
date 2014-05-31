/* jshint node: true */
/* jshint evil: true */
'use strict';

/**
  # Match Me

  This is an experimental library that will allow object matching based on a
  simple query language plus chainable function interface.

  ## Simple Example

  Matching is done at an object level against object properties, e.g.

  <<< examples/simple.js

  In addition `matchme` can be used in conjunction the filter
  function (both the native JS implemenation or underscores):

  <<< examples/simple-filter.js

  ## Pull-Stream Example

  An example using the [pull-stream](https://github.com/dominictarr/pull-stream)
  module is shown below.  This example reads data from a data file downloaded
  from [geonames](http://geonames.org) and loaded in through the
  [geonames](https://github.com/DamonOehlman/geonames) module which provides
  a pull-stream source.

  <<< examples/pull-stream.js

  Additionally, here is another example that uses a matchme regex to identify
  places that are named as Islands but are classified as something else:

  <<< examples/pull-stream-regex.js

  ## A Note regarding Eval

  In general, the use of `eval` is considered evil.  I have avoided using it
  for many, many years.  That said matchme makes use of eval to simplifying
  the parsing required to properly deal with complex expressions
  (BOMDAS, etc).

**/

var reExpr = /([\w\.]+)\s*([\><\!\=\~][\=\~]?)\s*([\-\w\.]+)/;
var reQuotedExpr = /([\w\.]+)\s*([\><\!\=\~][\=\~]?)\s*[\"\']([^\"\']+)[\"\']/;
var reRegexExpr = /([\w\.]+)\s*([\=\!]\?)\s*(\/[^\s]+\/\w*)/;
var reRegex = /^\/(.*)\/(\w*)$/;
var reBool = /^(true|false)$/i;
var reFalsyWords = /(undefined|null|false)/g;
var reTruthyWords = /(true)/g;
var reWords = /([\w\.]{2,})/;
var reSillyFn = /0\(.*?\)/g;
var exprLookups = {
  '==': ['equals'],
  '=~': ['looseEquals'],
  '~=': ['looseEquals'],
  '!~': ['looseEquals', 'not'],
  '>':  ['gt'],
  '>=': ['gte'],
  '<':  ['lt'],
  '<=': ['lte'],
  '!=': ['equals', 'not'],
  '=?': ['regex'],
  '!?': ['regex', 'not']
};

var wordReplacements = {
  and: '&&',
  or: '||'
};

/**
  ## Matcher prototype reference

**/
function Matcher(target, opts) {
  // initialise options
  this.opts = opts || {};

  // initialise members
  this.target = target;
  this.ok = true;
}

Matcher.prototype = {
  /**
  ### gt(prop, value, result?)

  Check whether the specified property of the target object is greater than
  the specified value.  If the optional result argument is passed to the
  function then the result is passed back in that object. If not the result
  is stored in the local `ok` property of the matcher instance.  Other
  comparison methods use the same principle as this function.
  **/
  gt: function(prop, value, result) {
    result = result || this;
    result.ok = result.ok && this.target && this._val(prop) > value;

    return this;
  },

  /**
  ### gte(prop, value, result?)

  Greater than or equal to check.
  **/
  gte: function(prop, value, result) {
    result = result || this;
    result.ok = result.ok && this.target && this._val(prop) >= value;

    return this;
  },

  /**
  ### lt(prop, value, result?)

  Less than property value check
  **/
  lt: function(prop, value, result) {
    result = result || this;
    result.ok = result.ok && this.target && this._val(prop) < value;

    return this;
  },

  /**
  ### lte(prop, value, result?)

  Less than or equal to check
  **/
  lte: function(prop, value, result) {
    result = result || this;
    result.ok = result.ok && this.target && this._val(prop) <= value;

    return this;
  },

  /**
  ### equals(prop, value, result?)

  Equality check
  **/
  equals: function(prop, value, result) {
    result = result || this;
    if (result.ok && this.target) {
      result.ok = this._val(prop) === value;
    }

    return this;
  },

  /**
  ### looseEquals(prop, value, result?)

  Equality check (case insensitive)
  **/
  looseEquals: function(prop, value, result) {
    var testVal;
    var strings;

    result = result || this;
    if (result.ok && this.target) {
      testVal = this._val(prop);
      strings = (typeof testVal == 'string' || testVal instanceof String) &&
        (typeof value == 'string' || value instanceof String);

      // if the test value is a string and the value is a string
      result.ok = strings ?
        testVal.toLowerCase() === value.toLowerCase() :
        testVal === value;
    }

    return this;
  },

  /**
  ### not(prop, value, result?)

  **/
  not: function(prop, value, result) {
    // invert the passes state
    result = result || this;
    result.ok = !result.ok;

    return this;
  },

  /**
  ### regex(prop, value, result?)

  **/
  regex: function(prop, value, result) {
    var regex;
    var match;

    result = result || this;
    if (result.ok && this.target) {
      regex = value;

      // if the regex is currently a string, then parse into a
      // regular expression
      if (typeof regex == 'string' || regex instanceof String) {
        match = reRegex.exec(value);
        if (match) {
          regex = new RegExp(match[1], match[2]);
        }
      }

      // if we now have a regex, then update the result ok
      if (regex instanceof RegExp) {
        result.ok = regex.test(this._val(prop));
      }
    }

    return this;
  },

  /**
  ### query(text)

  **/
  query: function(text) {
    var match;
    var replacement;

    // evaluate expressions
    text = this._evaluateExpressions(text, reQuotedExpr);
    text = this._evaluateExpressions(text, reRegexExpr);
    text = this._evaluateExpressions(text, reExpr);

    // replace falsy words with 0s and truthy words with 1s
    text = text.replace(reFalsyWords, '0').replace(reTruthyWords, '1');

    // find any remaining standalone words
    match = reWords.exec(text);
    while (match) {
      replacement = wordReplacements[match[0].toLowerCase()];

      // if we don't have a replacement for a word then look for the value
      // of the property on the target
      if ((! replacement) && this.target) {
        replacement = this._val(match[0]) ? true : false;
      }

      text = text.slice(0, match.index) + replacement +
        text.slice(match.index + match[0].length);

      // replace falsy words with 0s and truthy words with 1s
      text = text.replace(reFalsyWords, '0').replace(reTruthyWords, '1');

      // run the test again
      match = reWords.exec(text);
    }

    // replace peoples attempts at including functions with 0
    text = text.replace(reSillyFn, '0');

    // evaluate the expression
    try {
      this.ok = !!eval(text);
    }
    catch (e) {
      this.ok = false;
      this._errtext = text;
    }

    return this;
  },

  /**
  ## Internal Helpers

  ### _evaluateExpressions(text, expr)

  **/
  _evaluateExpressions: function(text, expr) {
    var match = expr.exec(text);
    var fns;
    var result;
    var val1;
    var val2;
    var ii;
    var count;
    var evaluator;

    while (match) {
      fns = exprLookups[match[2]] || [];
      result = { ok: fns.length > 0 };
      val1 = parseFloat(match[1]) || match[1];
      val2 = parseFloat(match[3]) || match[3];

      // if value 2 is a boolean, then parse it
      if (reBool.test(val2)) {
        val2 = val2 == 'true';
      }

      // iterate through the required functions in order and evaluate
      // the result
      for (ii = 0, count = fns.length; ii < count; ii++) {
        evaluator = this[fns[ii]];

        // if we have the evaluator, then run it
        if (evaluator) {
          evaluator.call(this, val1, val2, result);
        }
      }

      text = text.slice(0, match.index) + result.ok +
        text.slice(match.index + match[0].length);

      match = expr.exec(text);
    }

    return text;
  },

  /**
  ### _val(prop)

  **/
  _val: function(prop) {
    var value = this.target[prop];
    var props;

    // if the value is undefined, we'll attempt looking for
    // nested properties
    if (typeof value == 'undefined') {
      props = prop.split('.');
      if (props.length > 1) {
        value = this.target;
        while (value && props.length) {
          value = value[props.shift()];
        }
      }
    }

    return value;
  }
};

/*
Create a matcher that will execute against the specified target.
*/
var matchme = module.exports = function(target, opts, query) {
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
};

matchme.filter = function(array, query, opts) {
  var matcher;
  var results;
  var ii;
  var count;

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
    results = [];
    for (ii = 0, count = array.length; ii < count; ii++) {
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
