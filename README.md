# Match Me

This is an experimental library that will allow object matching based on a
simple query language plus chainable function interface.

[!
[Build Status]
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

### _evaluateExpressions(text, expr)

### _val(prop)
