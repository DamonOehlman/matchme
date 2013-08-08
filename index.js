/* jshint node: true */
'use strict';

/**
  # Match Me

  This is an experimental library that will allow object matching based on a
  simple query language plus chainable function interface.

  [
  ![Build Status]
  (https://travis-ci.org/DamonOehlman/matchme.png?branch=master)
  ](https://travis-ci.org/DamonOehlman/matchme)

  [
  ![browser support]
  (https://ci.testling.com/DamonOehlman/matchme.png)
  ](https://ci.testling.com/DamonOehlman/matchme)

  ## Simple Example

  Matching is done at an object level against object properties, e.g.

  ```js
  var test = { name: 'Ted', age: 40 };

  matchme(test, 'name == ted'); // true
  matchme(test, 'age > 25'); // true
  matchme(test, { caseSensitive: true }, 'name == ted'); // false
  matchme(test, 'name == ted && age > 45'); // false
  ```

  In addition `matchme` can be used in conjunction the filter
  function (both the native JS implemenation or underscores):

  ```js
  var people = [
    { name: 'Ted', age: 40 },
    { name: 'Bill', age: 42 }
  ];

  people.filter(matchme.filter('age > 40')); // [ { name: 'Bill', age: 42 }]
  ```

  For more complicated examples, I'd recommend having a look at the
  tests (which run from both the browser and node).

  ## A Note regarding Eval

  In general, the use of `eval` is considered evil.  I have avoided using it
  for many, many years.  That said matchme makes use of eval to simplifying
  the parsing required to properly deal with complex expressions
  (BOMDAS, etc).

**/

var Parser = require('./parser');

var exprLookups = {
  '==': ['equals'],
  '>':  ['gt'],
  '>=': ['gte'],
  '<':  ['lt'],
  '<=': ['lte'],
  '!=': ['equals', 'not'],
  '=~': ['regex'],
  '!~': ['regex', 'not']
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
    var testVal;
    var strings;

    result = result || this;
    if (result.ok && this.target) {
      testVal = this._val(prop);

      // if the test value is a string and the value is a string
      result.ok = testVal === value;
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

  query: function(text) {
    var query = new Parser();
    this.ok = query.evaluate(text, this.target);
    return this;
  },
    
  _val: function(prop) {
    var value = this.target[prop];
    var props;

    // if the value is undefined, we'll attempt looking for nested properties
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