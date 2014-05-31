# matchme

This is an experimental library that will allow object matching based on a
simple query language plus chainable function interface.


[![NPM](https://nodei.co/npm/matchme.png)](https://nodei.co/npm/matchme/)


[![browser support](https://ci.testling.com/DamonOehlman/matchme.png)](https://ci.testling.com/DamonOehlman/matchme)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/badges/stability-badges) [![Build Status](https://img.shields.io/travis/DamonOehlman/matchme.svg?branch=master)](https://travis-ci.org/DamonOehlman/matchme) [![Dependency Status](https://david-dm.org/DamonOehlman/matchme.svg)](https://david-dm.org/DamonOehlman/matchme) 

## 2.0 Breaking Changes

- The equality operator `==` is now a __case-senstive__ match
- A loose equality operator `~=` can be used for case insensitive matches.
- Regex operators are now implemented using `=?` for a match and `!?` for not.

## Simple Example

Matching is done at an object level against object properties, e.g.

```js
var matchme = require('matchme');
var test = { name: 'Ted', age: 40 };

console.log(matchme(test, 'name == Ted'));
// --> true

console.log(matchme(test, 'name == ted'));
// --> false

console.log(matchme(test, 'name ~= ted'));
// --> true

console.log(matchme(test, 'age > 25'));
// --> true

console.log(matchme(test, 'name ~= ted && age > 45'));
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

## Pull-Stream Example

An example using the [pull-stream](https://github.com/dominictarr/pull-stream)
module is shown below.  This example reads data from a data file downloaded
from [geonames](http://geonames.org) and loaded in through the
[geonames](https://github.com/DamonOehlman/geonames) module which provides
a pull-stream source.

```js
var geonames = require('geonames');
var pull = require('pull-stream');
var matchme = require('matchme');

console.log('Places with a population > 500,000 (limited to first 10):');

pull(
  geonames.read(__dirname + '/data/AU.txt'),
  pull.filter(matchme.filter('featureClass == P && population > 500000')),
  pull.take(10),
  pull.drain(function(place) {
    console.log(place.name);
  })
);

```

Additionally, here is another example that uses a matchme regex to identify
places that are named as Islands but are classified as something else:

```js
var geonames = require('geonames');
var pull = require('pull-stream');
var matchme = require('matchme');

pull(
  geonames.read(__dirname + '/data/AU.txt'),
  pull.filter(matchme.filter('name =? /Island$/ && featureCode != ISL')),
  pull.drain(function(place) {
    console.log(place.name + ' might seem like an island but is in fact a ' + place.featureCode);
  })
);

```

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

### looseEquals(prop, value, result?)

Equality check (case insensitive)

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
