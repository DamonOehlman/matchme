# Match Me

This is an experimental library that will allow object matching based on a
simple query language plus chainable function interface.


[![NPM](https://nodei.co/npm/matchme.png)](https://nodei.co/npm/matchme/)

[![Build Status](https://img.shields.io/travis/DamonOehlman/matchme.svg?branch=master)](https://travis-ci.org/DamonOehlman/matchme)

[![browser support](https://ci.testling.com/DamonOehlman/matchme.png)](https://ci.testling.com/DamonOehlman/matchme)



## Simple Example

Matching is done at an object level against object properties, e.g.

```js
var matchme = require('matchme');
var test = { name: 'Ted', age: 40 };

console.log(matchme(test, 'name == ted'));
// --> true

console.log(matchme(test, 'age > 25'));
// --> true

console.log(matchme(test, { caseSensitive: true }, 'name == ted'));
// --> false

console.log(matchme(test, 'name == ted && age > 45'));
// --> false
```

In addition `matchme` can be used in conjunction the filter
function (both the native JS implemenation or underscores):

```js
var matchme = require('matchme');
var people = [
  { name: 'Ted', age: 40 },
  { name: 'Bill', age: 42 }
];

console.log(people.filter(matchme.filter('age > 40')));
// --> [ { name: 'Bill', age: 42 }]
```

For more complicated examples, I'd recommend having a look at the
tests (which run from both the browser and node).

## A Note regarding Eval

In general, the use of `eval` is considered evil.  I have avoided using it
for many, many years.  That said matchme makes use of eval to simplifying
the parsing required to properly deal with complex expressions
(BOMDAS, etc).

## Matcher prototype reference

### gt(prop, value, result?)

Check whether the specified property of the target object is greater than 
the specified value.  If the optional result argument is passed to the
function then the result is passed back in that object. If not the result
is stored in the local `ok` property of the matcher instance.  Other
comparison methods use the same principle as this function.

 
### gte(prop, value, result?)

Greater than or equal to check.

### lt(prop, value, result?)

Less than property value check

### lte(prop, value, result?)

Less than or equal to check

### equals(prop, value, result?)

Equality check

### not(prop, value, result?)

### regex(prop, value, result?)

### query(text)

## Internal Helpers

### _evaluateExpressions(text, expr)

### _val(prop)

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
