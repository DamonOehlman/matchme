var geonames = require('geonames');
var pull = require('pull-stream');
var matchme = require('..');

console.log('Places with a population > 500,000 (limited to first 10):');

pull(
  geonames.read(__dirname + '/data/AU.txt'),
  pull.filter(matchme.filter('featureClass == P && population > 500000')),
  pull.take(10),
  pull.drain(function(place) {
    console.log(place.name);
  })
);
