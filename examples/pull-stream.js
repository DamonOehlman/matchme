var geonames = require('geonames');
var pull = require('pull-stream');
var matchme = require('..');

pull(
  geonames.read(__dirname + '/data/AU.txt'),
  pull.filter(matchme.filter('featureClass == P && population > 50000')),
  pull.take(10),
  pull.collect(function(err, places) {
    console.log('found ' + places.length + ' matching places');
  })
);
