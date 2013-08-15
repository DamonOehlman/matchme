var matchme = require('..');
var people = [
  { name: 'Ted', age: 40 },
  { name: 'Bill', age: 42 }
];

console.log(people.filter(matchme.filter('age > 40')));
// --> [ { name: 'Bill', age: 42 }]