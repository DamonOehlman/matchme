# Match Me

This is an experimental library that will allow object matching based on a simple query language plus chainable function interface.

<a href="http://travis-ci.org/#!/DamonOehlman/matchme"><img src="https://secure.travis-ci.org/DamonOehlman/matchme.png" alt="Build Status"></a>

## Simple Example

Matching is done at an object level against object properties, e.g.

```js
var test = { name: 'Ted', age: 40 };

matchme(test, 'name == ted'); // true
matchme(test, 'age > 25'); // true
matchme(test, { caseSensitive: true }, 'name == ted'); // false
matchme(test, 'name == ted && age > 45'); // false
```

In addition `matchme` can be used in conjunction the filter function (both the native JS implemenation or underscores):

```js
var people = [
    { name: 'Ted', age: 40 },
    { name: 'Bill', age: 42 }
];

people.filter(matchme.filter('age > 40')); // [ { name: 'Bill', age: 42 }]
```

For more complicated examples, I'd recommend having a look at the tests (which run from both the browser and node).

## A Note regarding Eval

In general, the use of `eval` is considered evil.  I have avoided using it for many, many years.  That said matchme makes use of eval to simplifying the parsing required to properly deal with complex expressions (BOMDAS, etc).