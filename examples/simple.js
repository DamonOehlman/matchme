var matchme = require('..');
var test = { name: 'Ted', age: 40 };

console.log(matchme(test, 'name == ted'));
// --> true

console.log(matchme(test, 'age > 25'));
// --> true

console.log(matchme(test, { caseSensitive: true }, 'name == ted'));
// --> false

console.log(matchme(test, 'name == ted && age > 45'));
// --> false